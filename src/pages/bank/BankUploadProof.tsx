import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, FileText, Camera, CheckCircle2, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BankUploadProof() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (type: "camera" | "file") => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploadedFile(type === "camera" ? "bank_statement_photo.jpg" : "bank_statement.pdf");
      setIsUploading(false);
    }, 1500);
  };

  const handleSubmit = () => {
    navigate("/bank/pending");
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <div className="p-4 pt-8 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-foreground pr-10">
          {t("uploadProof")}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-3">
        <p className="text-muted-foreground text-sm mb-4">
          {t("uploadProof")}
        </p>

        {/* Upload Options */}
        {!uploadedFile && !isUploading && (
          <div className="space-y-3">
            <button
              onClick={() => handleUpload("camera")}
              className="w-full flex items-center gap-3 p-4 bg-card border-2 border-dashed border-border rounded-xl hover:border-primary transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Take Photo</p>
                <p className="text-xs text-muted-foreground">Use your camera</p>
              </div>
            </button>

            <button
              onClick={() => handleUpload("file")}
              className="w-full flex items-center gap-3 p-4 bg-card border-2 border-dashed border-border rounded-xl hover:border-primary transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Upload File</p>
                <p className="text-xs text-muted-foreground">PDF or image file</p>
              </div>
            </button>
          </div>
        )}

        {/* Uploading State */}
        {isUploading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-foreground font-medium text-sm">{t("loading")}</p>
          </div>
        )}

        {/* Uploaded File */}
        {uploadedFile && !isUploading && (
          <div className="bg-card rounded-xl p-3 patela-shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{uploadedFile}</p>
                <p className="text-xs text-success">{t("success")}</p>
              </div>
              <button 
                onClick={() => setUploadedFile(null)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}

        {/* What to upload */}
        <div className="mt-4 p-3 bg-muted/50 rounded-xl">
          <h3 className="font-semibold text-foreground text-sm mb-2">What to upload:</h3>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
              <span>Bank statement showing your name and account number</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
              <span>Statement should be from the last 3 months</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
              <span>Clear photo with all text visible</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-4 flex flex-col items-center">
        <Button 
          variant="default"
          size="default" 
          className="w-[220px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          onClick={handleSubmit}
          disabled={!uploadedFile}
        >
          <Upload className="mr-1.5 h-4 w-4" />
          {t("confirm")}
        </Button>
      </div>
    </div>
  );
}
