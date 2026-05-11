-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'cashier');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  email TEXT,
  business_name TEXT,
  business_type TEXT,
  id_number TEXT,
  pin_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'cashier',
  UNIQUE (user_id, role)
);

-- Create team_members table for multi-user support (up to 10 users per account)
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  member_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  role app_role NOT NULL DEFAULT 'cashier',
  is_active BOOLEAN NOT NULL DEFAULT true,
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payout_settings table
CREATE TABLE public.payout_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  payout_speed TEXT NOT NULL DEFAULT '24_hours' CHECK (payout_speed IN ('same_day', '24_hours')),
  same_day_fee_percent NUMERIC(5,2) NOT NULL DEFAULT 2.5,
  standard_fee_percent NUMERIC(5,2) NOT NULL DEFAULT 1.0,
  bank_linked BOOLEAN NOT NULL DEFAULT false,
  device_paired BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales table for tracking transactions
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cashier_id UUID REFERENCES auth.users(id),
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'card' CHECK (payment_method IN ('card', 'cash', 'qr', 'other')),
  status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed', 'refunded', 'queued')),
  last_four_digits TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create catalog_items table for persistent items
CREATE TABLE public.catalog_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is team owner or member
CREATE OR REPLACE FUNCTION public.is_team_member(_user_id UUID, _owner_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE owner_user_id = _owner_id AND member_user_id = _user_id AND is_active = true
  ) OR _user_id = _owner_id
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Team members policies
CREATE POLICY "Owners can manage their team"
ON public.team_members FOR ALL
USING (auth.uid() = owner_user_id);

CREATE POLICY "Team members can view their team"
ON public.team_members FOR SELECT
USING (auth.uid() = member_user_id);

-- Payout settings policies
CREATE POLICY "Users can view their own payout settings"
ON public.payout_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own payout settings"
ON public.payout_settings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payout settings"
ON public.payout_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Sales policies
CREATE POLICY "Users can view their own sales"
ON public.sales FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = cashier_id);

CREATE POLICY "Users can insert sales"
ON public.sales FOR INSERT
WITH CHECK (auth.uid() = user_id OR auth.uid() = cashier_id);

CREATE POLICY "Users can update their own sales"
ON public.sales FOR UPDATE
USING (auth.uid() = user_id);

-- Catalog items policies
CREATE POLICY "Users can view their own catalog"
ON public.catalog_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own catalog"
ON public.catalog_items FOR ALL
USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payout_settings_updated_at
BEFORE UPDATE ON public.payout_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_catalog_items_updated_at
BEFORE UPDATE ON public.catalog_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile and assign admin role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin');
  
  INSERT INTO public.payout_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();