import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, CheckCircle2, ArrowRight, FileText, Building2 } from "lucide-react";

const DOCUMENT_TYPES = [
  { value: "company_registration", label: "Company Registration (CIPC)", required: true },
  { value: "director_id", label: "Director's ID Document", required: true },
  { value: "proof_of_address", label: "Proof of Address", required: true },
  { value: "bank_confirmation", label: "Bank Confirmation Letter", required: true },
  { value: "tax_clearance", label: "Tax Clearance Certificate", required: false },
  { value: "bee_certificate", label: "BEE Certificate", required: false },
];

const BUSINESS_TYPES = [
  "Retail & E-Commerce", "Food & Beverage", "Professional Services", "Technology",
  "Healthcare", "Education", "Travel & Hospitality", "Non-Profit", "Other"
];

export default function PaygateOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Business details
  const [businessType, setBusinessType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [businessProvince, setBusinessProvince] = useState("");
  const [businessPostalCode, setBusinessPostalCode] = useState("");

  // Documents
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { name: string; path: string }>>({});
  const [uploading, setUploading] = useState<string | null>(null);

  const handleSaveBusinessDetails = async () => {
    if (!businessType || !registrationNumber) {
      toast.error("Please fill in required fields");
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("merchants").update({
        business_type: businessType,
        registration_number: registrationNumber,
        tax_number: taxNumber || null,
        description: description || null,
        website_url: websiteUrl || null,
        business_address: businessAddress || null,
        business_city: businessCity || null,
        business_province: businessProvince || null,
        business_postal_code: businessPostalCode || null,
      }).eq("user_id", user.id);

      if (error) throw error;
      setStep(2);
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDoc = async (docType: string, file: File) => {
    setUploading(docType);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const filePath = `${user.id}/${docType}_${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from("merchant-documents").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: merchant } = await supabase.from("merchants").select("id").eq("user_id", user.id).single();
      if (!merchant) throw new Error("Merchant not found");

      const { error: docError } = await supabase.from("merchant_documents").insert({
        merchant_id: merchant.id,
        document_type: docType,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
      });
      if (docError) throw docError;

      setUploadedDocs(prev => ({ ...prev, [docType]: { name: file.name, path: filePath } }));
      toast.success(`${file.name} uploaded`);
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const handleSubmitForReview = async () => {
    const requiredDocs = DOCUMENT_TYPES.filter(d => d.required).map(d => d.value);
    const missing = requiredDocs.filter(d => !uploadedDocs[d]);
    if (missing.length > 0) {
      toast.error(`Please upload all required documents (${missing.length} missing)`);
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      await supabase.from("merchants").update({ status: "under_review" }).eq("user_id", user.id);
      setStep(3);
    } catch (e: any) {
      toast.error(e.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <PatelaLogo size="md" />
            <span className="text-accent font-bold text-sm border border-accent/40 rounded-full px-2 py-0.5">PayGate</span>
          </div>
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate("/paygate/dashboard")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors">
            <ArrowLeft className="h-4 w-4" /> {step > 1 ? "Back" : "Dashboard"}
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-1 rounded-full ${step > s ? "bg-accent" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Business Information</h1>
                <p className="text-sm text-muted-foreground">Tell us about your business</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Business Type *</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger><SelectValue placeholder="Select business type" /></SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>CIPC Registration Number *</Label>
                <Input placeholder="e.g. 2024/123456/07" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} />
              </div>
              <div>
                <Label>Tax Number (Optional)</Label>
                <Input placeholder="e.g. 9123456789" value={taxNumber} onChange={e => setTaxNumber(e.target.value)} />
              </div>
              <div>
                <Label>Business Description</Label>
                <Input placeholder="What does your business do?" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div>
                <Label>Website URL (Optional)</Label>
                <Input placeholder="https://www.example.co.za" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Address</Label>
                  <Input placeholder="Street address" value={businessAddress} onChange={e => setBusinessAddress(e.target.value)} />
                </div>
                <div>
                  <Label>City</Label>
                  <Input placeholder="City" value={businessCity} onChange={e => setBusinessCity(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Province</Label>
                  <Input placeholder="Province" value={businessProvince} onChange={e => setBusinessProvince(e.target.value)} />
                </div>
                <div>
                  <Label>Postal Code</Label>
                  <Input placeholder="0001" value={businessPostalCode} onChange={e => setBusinessPostalCode(e.target.value)} />
                </div>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" size="lg" disabled={loading} onClick={handleSaveBusinessDetails}>
                {loading ? "Saving..." : "Continue to Documents"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">KYC Documents</h1>
                <p className="text-sm text-muted-foreground">Upload your verification documents</p>
              </div>
            </div>
            <div className="space-y-4">
              {DOCUMENT_TYPES.map(doc => (
                <div key={doc.value} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground text-sm">{doc.label}</p>
                      <p className="text-xs text-muted-foreground">{doc.required ? "Required" : "Optional"}</p>
                    </div>
                    {uploadedDocs[doc.value] ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : null}
                  </div>
                  {uploadedDocs[doc.value] ? (
                    <p className="text-xs text-success">{uploadedDocs[doc.value].name}</p>
                  ) : (
                    <label className="flex items-center gap-2 cursor-pointer bg-muted hover:bg-muted/80 rounded-lg p-3 transition-colors">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {uploading === doc.value ? "Uploading..." : "Choose file"}
                      </span>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" disabled={uploading === doc.value}
                        onChange={e => { if (e.target.files?.[0]) handleUploadDoc(doc.value, e.target.files[0]); }} />
                    </label>
                  )}
                </div>
              ))}
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" size="lg" disabled={loading} onClick={handleSubmitForReview}>
                {loading ? "Submitting..." : "Submit for Review"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h1>
            <p className="text-muted-foreground mb-2">Your documents are under review.</p>
            <p className="text-sm text-muted-foreground mb-8">We'll verify your business within 24-48 hours. You'll receive an email notification once approved.</p>
            <p className="text-sm text-muted-foreground mb-4">In the meantime, you can explore your sandbox dashboard.</p>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" size="lg" onClick={() => navigate("/paygate/dashboard")}>
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
