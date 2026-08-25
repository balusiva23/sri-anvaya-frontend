'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';
import TopHeader from '../../../components/TopHeader';
import Modal from '../../../components/Modal';
import {
  Settings as SettingsIcon,
  Server,
  Database,
  Cloud,
  CreditCard,
  MessageSquare,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  HardDrive,
  FileJson,
  Check,
  Sparkles,
  Layers,
  Building2,
  MapPin,
  Phone,
  Clock,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'INFRA' | 'CONTACT' | 'BACKUP' | 'BUSINESS'>('INFRA');
  const [infraConfig, setInfraConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingService, setSavingService] = useState<string | null>(null);
  const [testingService, setTestingService] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Show/Hide Secrets State
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // Editable Form States
  const [mongoForm, setMongoForm] = useState({ uri: '' });
  const [activeStorageProvider, setActiveStorageProvider] = useState<'cloudinary' | 'aws_s3' | 'azure_blob'>('cloudinary');
  const [cloudinaryForm, setCloudinaryForm] = useState({ cloudName: '', apiKey: '', apiSecret: '' });
  const [awsS3Form, setAwsS3Form] = useState({ bucket: 'sri-anvaya-vault', region: 'ap-south-1', accessKeyId: '', secretAccessKey: '' });
  const [azureBlobForm, setAzureBlobForm] = useState({ account: 'srianvayastorage', container: 'pitru-records', connectionString: '' });
  const [razorpayForm, setRazorpayForm] = useState({ keyId: '', keySecret: '', webhookSecret: '' });
  const [stripeForm, setStripeForm] = useState({ publishableKey: '', secretKey: '', webhookSecret: '' });
  const [whatsappForm, setWhatsappForm] = useState({ provider: 'Gupshup Enterprise', apiKey: '', senderNumber: '' });
  const [emailForm, setEmailForm] = useState({ smtpHost: '', smtpPort: '587', smtpUser: '', smtpPass: '', fromEmail: '' });
  const [smsForm, setSmsForm] = useState({ provider: 'DLT Fast2SMS', apiKey: '', senderId: 'ANVAYA' });
  const [welfarePercent, setWelfarePercent] = useState(12);

  // Dynamic Contact Form State (National Headquarters & Get In Touch)
  const [contactForm, setContactForm] = useState({
    headquartersTitle: 'National Headquarters',
    headquartersSubtitle: 'Serving Chennai, Bengaluru, Hyderabad, Mumbai, Delhi-NCR, and Overseas NRIs.',
    operationsCenterTitle: 'Operations Centre',
    address: 'Heritage Arcade, North Mada Street, Mylapore, Chennai, TN 600004',
    phone: '+91 98840 12345 / +91 44 2499 5500',
    email: 'care@srianvaya.com / support@srianvaya.com',
    timings: '8 AM - 8 PM IST (Mon - Sun)',
    footerLocations: 'Mylapore / Bengaluru / Hyderabad (Expanding Pan-India & NRI Services)',
    welfareBadgeText: '12% Provider Welfare Committed',
    tagline: 'Honouring Roots. Enriching Generations.',
  });
  const [savingContact, setSavingContact] = useState(false);

  // Backup & Restore State
  const [backupStats, setBackupStats] = useState<any>(null);
  const [selectedBackupFile, setSelectedBackupFile] = useState<File | null>(null);
  const [backupFileContent, setBackupFileContent] = useState<any>(null);
  const [restoreMode, setRestoreMode] = useState<'OVERWRITE' | 'MERGE'>('OVERWRITE');
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreResult, setRestoreResult] = useState<any>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  useEffect(() => {
    loadAllConfigs();
  }, []);

  const loadAllConfigs = async () => {
    try {
      setLoading(true);
      const [config, settings, backupSnapshot, contactInfo] = await Promise.all([
        apiFetch('/settings/infra-config'),
        apiFetch('/settings'),
        apiFetch('/settings/backup/export'),
        apiFetch('/settings/contact-info').catch(() => null),
      ]);

      setInfraConfig(config);
      setBackupStats(backupSnapshot?.summary);
      if (contactInfo) {
        setContactForm((prev) => ({
          ...prev,
          ...contactInfo,
        }));
      }

      if (config.storage?.activeProvider) {
        setActiveStorageProvider(config.storage.activeProvider);
      }

      // Populate forms
      if (config.mongodb) setMongoForm({ uri: config.mongodb.uri || '' });
      if (config.cloudinary) {
        setCloudinaryForm({
          cloudName: config.cloudinary.cloudName || '',
          apiKey: config.cloudinary.apiKey || '',
          apiSecret: config.cloudinary.apiSecret || '',
        });
      }
      if (config.awsS3) {
        setAwsS3Form({
          bucket: config.awsS3.bucket || 'sri-anvaya-vault',
          region: config.awsS3.region || 'ap-south-1',
          accessKeyId: config.awsS3.accessKeyId || '',
          secretAccessKey: config.awsS3.secretAccessKey || '',
        });
      }
      if (config.azureBlob) {
        setAzureBlobForm({
          account: config.azureBlob.account || 'srianvayastorage',
          container: config.azureBlob.container || 'pitru-records',
          connectionString: config.azureBlob.connectionString || '',
        });
      }
      if (config.razorpay) {
        setRazorpayForm({
          keyId: config.razorpay.keyId || '',
          keySecret: config.razorpay.keySecret || '',
          webhookSecret: config.razorpay.webhookSecret || '',
        });
      }
      if (config.stripe) {
        setStripeForm({
          publishableKey: config.stripe.publishableKey || '',
          secretKey: config.stripe.secretKey || '',
          webhookSecret: config.stripe.webhookSecret || '',
        });
      }
      if (config.whatsapp) {
        setWhatsappForm({
          provider: config.whatsapp.provider || 'Gupshup Enterprise',
          apiKey: config.whatsapp.apiKey || '',
          senderNumber: config.whatsapp.senderNumber || '+91 98840 12345',
        });
      }
      if (config.email) {
        setEmailForm({
          smtpHost: config.email.smtpHost || '',
          smtpPort: config.email.smtpPort || '587',
          smtpUser: config.email.smtpUser || '',
          smtpPass: '',
          fromEmail: config.email.fromEmail || 'care@srianvaya.com',
        });
      }
      if (config.sms) {
        setSmsForm({
          provider: config.sms.provider || 'DLT Fast2SMS',
          apiKey: config.sms.apiKey || '',
          senderId: config.sms.senderId || 'ANVAYA',
        });
      }

      const wSet = settings.find((s: any) => s.key === 'DEFAULT_WELFARE_PERCENTAGE');
      if (wSet) setWelfarePercent(wSet.value);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const toggleSecret = (field: string) => {
    setShowSecrets((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveService = async (service: string, payload: any) => {
    setSavingService(service);
    try {
      const res = await apiFetch(`/settings/infra-config/${service}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      showNotification('success', res.message || `${service.toUpperCase()} configuration updated!`);
      loadAllConfigs();
    } catch (err: any) {
      showNotification('error', err.message || `Failed to update ${service}`);
    } finally {
      setSavingService(null);
    }
  };

  const handleTestService = async (service: string) => {
    setTestingService(service);
    try {
      const res = await apiFetch(`/settings/test-connection/${service}`, {
        method: 'POST',
      });
      if (res.success) {
        showNotification('success', res.message || `${service.toUpperCase()} connection test successful!`);
      } else {
        showNotification('error', res.error || `${service.toUpperCase()} connection failed.`);
      }
    } catch (err: any) {
      showNotification('error', err.message || `Test connection failed for ${service}`);
    } finally {
      setTestingService(null);
    }
  };

  // Database Backup Download Trigger
  const handleExportBackup = async () => {
    try {
      const data = await apiFetch('/settings/backup/export');
      const jsonStr = JSON.stringify(data.snapshot, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateTag = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `sri-anvaya-database-backup-${dateTag}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('success', `Database backup downloaded successfully (${data.summary?.totalRecords} records)!`);
    } catch (err: any) {
      showNotification('error', `Backup download failed: ${err.message}`);
    }
  };

  // Database Import Handle
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedBackupFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          setBackupFileContent(parsed);
        } catch (err) {
          showNotification('error', 'Selected file is not valid JSON.');
          setSelectedBackupFile(null);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExecuteRestore = async () => {
    if (!backupFileContent) return;
    setIsRestoring(true);
    try {
      const res = await apiFetch('/settings/backup/import', {
        method: 'POST',
        body: JSON.stringify({
          snapshot: backupFileContent,
          mode: restoreMode,
        }),
      });
      setRestoreResult(res);
      setShowRestoreModal(false);
      showNotification('success', res.message);
      loadAllConfigs();
    } catch (err: any) {
      showNotification('error', `Restore failed: ${err.message}`);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="flex-1 pb-16">
      <TopHeader
        title="Enterprise Infrastructure, Gateway & Database Management"
        subtitle="Manage cloud databases, storage keys, multi-gateway credentials, communication pipelines, and database disaster recovery."
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {/* Toast Alert */}
        {notification && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all shadow-sm ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-charcoal-800/40 hover:text-charcoal-900">
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 border-b border-sand pb-4">
          <button
            onClick={() => setActiveTab('INFRA')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
              activeTab === 'INFRA'
                ? 'bg-maroon-700 text-white shadow-md'
                : 'bg-warmwhite border border-sand text-charcoal-800 hover:bg-cream/40'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Infrastructure & Gateways</span>
          </button>

          <button
            onClick={() => setActiveTab('CONTACT')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
              activeTab === 'CONTACT'
                ? 'bg-maroon-700 text-white shadow-md'
                : 'bg-warmwhite border border-sand text-charcoal-800 hover:bg-cream/40'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>🏛️ National Headquarters & Contact</span>
          </button>

          <button
            onClick={() => setActiveTab('BACKUP')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
              activeTab === 'BACKUP'
                ? 'bg-maroon-700 text-white shadow-md'
                : 'bg-warmwhite border border-sand text-charcoal-800 hover:bg-cream/40'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Database Backup & Restore (JSON)</span>
          </button>

          <button
            onClick={() => setActiveTab('BUSINESS')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
              activeTab === 'BUSINESS'
                ? 'bg-maroon-700 text-white shadow-md'
                : 'bg-warmwhite border border-sand text-charcoal-800 hover:bg-cream/40'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Business & Welfare Rules</span>
          </button>
        </div>

        {/* TAB 1: INFRASTRUCTURE & GATEWAYS */}
        {activeTab === 'INFRA' && (
          <div className="space-y-8">
            {/* 1. MongoDB Database */}
            <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-sand">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-maroon-900">MongoDB Database Cluster</h3>
                    <p className="text-xs text-charcoal-800/70">Central persistent database connection string.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    {infraConfig?.mongodb?.status || 'CONNECTED'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">
                    MongoDB Connection URI (SRV / Direct)
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets.mongo ? 'text' : 'password'}
                      value={mongoForm.uri}
                      onChange={(e) => setMongoForm({ uri: e.target.value })}
                      placeholder="mongodb+srv://user:password@cluster0.mongodb.net/dbname"
                      className="w-full pl-4 pr-12 py-3 rounded-xl border border-sand bg-canvas text-xs font-mono font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret('mongo')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-800/50 hover:text-charcoal-900"
                    >
                      {showSecrets.mongo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleSaveService('mongodb', mongoForm)}
                    disabled={savingService === 'mongodb'}
                    className="px-5 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingService === 'mongodb' ? 'Saving & Connecting...' : 'Save & Reconnect'}</span>
                  </button>
                  <button
                    onClick={() => handleTestService('mongodb')}
                    disabled={testingService === 'mongodb'}
                    className="px-4 py-2.5 rounded-xl border border-sand bg-canvas hover:bg-cream/40 text-charcoal-800 font-bold text-xs flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingService === 'mongodb' ? 'animate-spin' : ''}`} />
                    <span>Test Cluster Ping</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Multi-Cloud File & Media Storage Hub */}
            <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-sand">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-maroon-900">Multi-Cloud Storage & Document Vault</h3>
                    <p className="text-xs text-charcoal-800/70">
                      Select and configure your active document storage provider (Cloudinary, Amazon AWS S3, or Microsoft Azure Blob).
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-charcoal-800/60 uppercase">Active Provider:</span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase">
                    {activeStorageProvider === 'aws_s3' ? 'AWS S3' : activeStorageProvider === 'azure_blob' ? 'Azure Blob' : 'Cloudinary'}
                  </span>
                </div>
              </div>

              {/* Provider Selection Tabs / Radio Pill */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 rounded-2xl bg-canvas border border-sand">
                <button
                  type="button"
                  onClick={() => {
                    setActiveStorageProvider('cloudinary');
                    handleSaveService('storage_provider', { provider: 'cloudinary' });
                  }}
                  className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                    activeStorageProvider === 'cloudinary'
                      ? 'bg-maroon-700 text-white shadow-md'
                      : 'text-charcoal-800 hover:bg-cream/50'
                  }`}
                >
                  <Cloud className="w-4 h-4" />
                  <span>Cloudinary Media</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveStorageProvider('aws_s3');
                    handleSaveService('storage_provider', { provider: 'aws_s3' });
                  }}
                  className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                    activeStorageProvider === 'aws_s3'
                      ? 'bg-maroon-700 text-white shadow-md'
                      : 'text-charcoal-800 hover:bg-cream/50'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Amazon AWS S3</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveStorageProvider('azure_blob');
                    handleSaveService('storage_provider', { provider: 'azure_blob' });
                  }}
                  className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                    activeStorageProvider === 'azure_blob'
                      ? 'bg-maroon-700 text-white shadow-md'
                      : 'text-charcoal-800 hover:bg-cream/50'
                  }`}
                >
                  <Server className="w-4 h-4" />
                  <span>Microsoft Azure Blob</span>
                </button>
              </div>

              {/* A. CLOUDINARY CONFIGURATION */}
              {activeStorageProvider === 'cloudinary' && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Cloud Name</label>
                      <input
                        type="text"
                        value={cloudinaryForm.cloudName}
                        onChange={(e) => setCloudinaryForm({ ...cloudinaryForm, cloudName: e.target.value })}
                        placeholder="e.g. gc2damux"
                        className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">API Key</label>
                      <input
                        type="text"
                        value={cloudinaryForm.apiKey}
                        onChange={(e) => setCloudinaryForm({ ...cloudinaryForm, apiKey: e.target.value })}
                        placeholder="e.g. 121852572457978"
                        className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-xs font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">API Secret</label>
                      <div className="relative">
                        <input
                          type={showSecrets.cloudinary ? 'text' : 'password'}
                          value={cloudinaryForm.apiSecret}
                          onChange={(e) => setCloudinaryForm({ ...cloudinaryForm, apiSecret: e.target.value })}
                          placeholder="API Secret"
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-sand bg-canvas text-xs font-mono font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => toggleSecret('cloudinary')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-800/50"
                        >
                          {showSecrets.cloudinary ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => handleSaveService('cloudinary', cloudinaryForm)}
                      disabled={savingService === 'cloudinary'}
                      className="px-5 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingService === 'cloudinary' ? 'Saving...' : 'Save Cloudinary Keys'}</span>
                    </button>
                    <button
                      onClick={() => handleTestService('cloudinary')}
                      disabled={testingService === 'cloudinary'}
                      className="px-4 py-2.5 rounded-xl border border-sand bg-canvas hover:bg-cream/40 text-charcoal-800 font-bold text-xs flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${testingService === 'cloudinary' ? 'animate-spin' : ''}`} />
                      <span>Test Cloudinary Connection</span>
                    </button>
                  </div>
                </div>
              )}

              {/* B. AWS S3 CONFIGURATION */}
              {activeStorageProvider === 'aws_s3' && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">S3 Bucket Name</label>
                      <input
                        type="text"
                        value={awsS3Form.bucket}
                        onChange={(e) => setAwsS3Form({ ...awsS3Form, bucket: e.target.value })}
                        placeholder="e.g. sri-anvaya-vault"
                        className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-xs font-semibold font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">AWS Region</label>
                      <input
                        type="text"
                        value={awsS3Form.region}
                        onChange={(e) => setAwsS3Form({ ...awsS3Form, region: e.target.value })}
                        placeholder="e.g. ap-south-1"
                        className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-xs font-semibold font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">AWS Access Key ID</label>
                      <input
                        type="text"
                        value={awsS3Form.accessKeyId}
                        onChange={(e) => setAwsS3Form({ ...awsS3Form, accessKeyId: e.target.value })}
                        placeholder="AKIAIOSFODNN7EXAMPLE"
                        className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-xs font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">AWS Secret Access Key</label>
                      <div className="relative">
                        <input
                          type={showSecrets.awsS3 ? 'text' : 'password'}
                          value={awsS3Form.secretAccessKey}
                          onChange={(e) => setAwsS3Form({ ...awsS3Form, secretAccessKey: e.target.value })}
                          placeholder="Secret Access Key"
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-sand bg-canvas text-xs font-mono font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => toggleSecret('awsS3')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-800/50"
                        >
                          {showSecrets.awsS3 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => handleSaveService('aws_s3', awsS3Form)}
                      disabled={savingService === 'aws_s3'}
                      className="px-5 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingService === 'aws_s3' ? 'Saving...' : 'Save AWS S3 Configuration'}</span>
                    </button>
                    <button
                      onClick={() => handleTestService('aws_s3')}
                      disabled={testingService === 'aws_s3'}
                      className="px-4 py-2.5 rounded-xl border border-sand bg-canvas hover:bg-cream/40 text-charcoal-800 font-bold text-xs flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${testingService === 'aws_s3' ? 'animate-spin' : ''}`} />
                      <span>Test AWS S3 Endpoint Ping</span>
                    </button>
                  </div>
                </div>
              )}

              {/* C. AZURE BLOB CONFIGURATION */}
              {activeStorageProvider === 'azure_blob' && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Azure Storage Account</label>
                      <input
                        type="text"
                        value={azureBlobForm.account}
                        onChange={(e) => setAzureBlobForm({ ...azureBlobForm, account: e.target.value })}
                        placeholder="e.g. srianvayastorage"
                        className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-xs font-semibold font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Blob Container Name</label>
                      <input
                        type="text"
                        value={azureBlobForm.container}
                        onChange={(e) => setAzureBlobForm({ ...azureBlobForm, container: e.target.value })}
                        placeholder="e.g. pitru-records"
                        className="w-full px-4 py-3 rounded-xl border border-sand bg-canvas text-xs font-semibold font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">Connection String / SAS Key</label>
                      <div className="relative">
                        <input
                          type={showSecrets.azureBlob ? 'text' : 'password'}
                          value={azureBlobForm.connectionString}
                          onChange={(e) => setAzureBlobForm({ ...azureBlobForm, connectionString: e.target.value })}
                          placeholder="DefaultEndpointsProtocol=https;..."
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-sand bg-canvas text-xs font-mono font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => toggleSecret('azureBlob')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-800/50"
                        >
                          {showSecrets.azureBlob ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => handleSaveService('azure_blob', azureBlobForm)}
                      disabled={savingService === 'azure_blob'}
                      className="px-5 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingService === 'azure_blob' ? 'Saving...' : 'Save Azure Blob Configuration'}</span>
                    </button>
                    <button
                      onClick={() => handleTestService('azure_blob')}
                      disabled={testingService === 'azure_blob'}
                      className="px-4 py-2.5 rounded-xl border border-sand bg-canvas hover:bg-cream/40 text-charcoal-800 font-bold text-xs flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${testingService === 'azure_blob' ? 'animate-spin' : ''}`} />
                      <span>Test Azure Container Ping</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Payment Gateways (Razorpay & Stripe) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Razorpay Card */}
              <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-sand">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-cinzel text-base font-bold text-maroon-900">Razorpay Gateway</h3>
                      <p className="text-[11px] text-charcoal-800/70">Domestic UPI, Cards & NetBanking.</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                    {infraConfig?.razorpay?.status || 'TEST_MODE'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-charcoal-800/70 mb-1">Key ID</label>
                    <input
                      type="text"
                      value={razorpayForm.keyId}
                      onChange={(e) => setRazorpayForm({ ...razorpayForm, keyId: e.target.value })}
                      placeholder="rzp_test_... or rzp_live_..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-charcoal-800/70 mb-1">Key Secret</label>
                    <input
                      type={showSecrets.razorpay ? 'text' : 'password'}
                      value={razorpayForm.keySecret}
                      onChange={(e) => setRazorpayForm({ ...razorpayForm, keySecret: e.target.value })}
                      placeholder="Key Secret"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-charcoal-800/70 mb-1">Webhook Secret</label>
                    <input
                      type="password"
                      value={razorpayForm.webhookSecret}
                      onChange={(e) => setRazorpayForm({ ...razorpayForm, webhookSecret: e.target.value })}
                      placeholder="Webhook Secret"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => handleSaveService('razorpay', razorpayForm)}
                    className="px-4 py-2 rounded-xl bg-maroon-700 text-white font-bold text-xs shadow-sm"
                  >
                    Save Razorpay
                  </button>
                  <button
                    onClick={() => handleTestService('razorpay')}
                    className="px-3.5 py-2 rounded-xl border border-sand bg-canvas text-charcoal-800 font-bold text-xs"
                  >
                    Test Adapter
                  </button>
                </div>
              </div>

              {/* Stripe Card */}
              <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-sand">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-cinzel text-base font-bold text-maroon-900">Stripe Gateway</h3>
                      <p className="text-[11px] text-charcoal-800/70">Global Card & NRI currency subscriptions.</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold">
                    {infraConfig?.stripe?.status || 'TEST_MODE'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-charcoal-800/70 mb-1">Publishable Key</label>
                    <input
                      type="text"
                      value={stripeForm.publishableKey}
                      onChange={(e) => setStripeForm({ ...stripeForm, publishableKey: e.target.value })}
                      placeholder="pk_test_... or pk_live_..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-charcoal-800/70 mb-1">Secret Key</label>
                    <input
                      type={showSecrets.stripe ? 'text' : 'password'}
                      value={stripeForm.secretKey}
                      onChange={(e) => setStripeForm({ ...stripeForm, secretKey: e.target.value })}
                      placeholder="sk_test_... or sk_live_..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-charcoal-800/70 mb-1">Webhook Secret</label>
                    <input
                      type="password"
                      value={stripeForm.webhookSecret}
                      onChange={(e) => setStripeForm({ ...stripeForm, webhookSecret: e.target.value })}
                      placeholder="whsec_..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => handleSaveService('stripe', stripeForm)}
                    className="px-4 py-2 rounded-xl bg-maroon-700 text-white font-bold text-xs shadow-sm"
                  >
                    Save Stripe
                  </button>
                  <button
                    onClick={() => handleTestService('stripe')}
                    className="px-3.5 py-2 rounded-xl border border-sand bg-canvas text-charcoal-800 font-bold text-xs"
                  >
                    Test Adapter
                  </button>
                </div>
              </div>
            </div>

            {/* 4. WhatsApp Automation & Email Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* WhatsApp Automation Card */}
              <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-sand">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-cinzel text-base font-bold text-maroon-900">WhatsApp Automation Hub</h3>
                      <p className="text-[11px] text-charcoal-800/70">30-Day & 7-Day Tithi Reminders.</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                    INTEGRATED
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-charcoal-800/70 mb-1">Gateway Provider</label>
                    <input
                      type="text"
                      value={whatsappForm.provider}
                      onChange={(e) => setWhatsappForm({ ...whatsappForm, provider: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-charcoal-800/70 mb-1">Official WhatsApp Phone</label>
                    <input
                      type="text"
                      value={whatsappForm.senderNumber}
                      onChange={(e) => setWhatsappForm({ ...whatsappForm, senderNumber: e.target.value })}
                      placeholder="+91 98840 12345"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-charcoal-800/70 mb-1">API Key / Token</label>
                    <input
                      type="password"
                      value={whatsappForm.apiKey}
                      onChange={(e) => setWhatsappForm({ ...whatsappForm, apiKey: e.target.value })}
                      placeholder="Bearer token or API key"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => handleSaveService('whatsapp', whatsappForm)}
                    className="px-4 py-2 rounded-xl bg-maroon-700 text-white font-bold text-xs shadow-sm"
                  >
                    Save WhatsApp
                  </button>
                  <button
                    onClick={() => handleTestService('whatsapp')}
                    className="px-3.5 py-2 rounded-xl border border-sand bg-canvas text-charcoal-800 font-bold text-xs"
                  >
                    Send Test Ping
                  </button>
                </div>
              </div>

              {/* Email & SMS Card */}
              <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-sand">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-cinzel text-base font-bold text-maroon-900">Email & SMS Relay</h3>
                      <p className="text-[11px] text-charcoal-800/70">Transactional invoices & OTP delivery.</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-gold-50 text-gold-800 border border-gold-200 text-[10px] font-bold">
                    CONFIGURED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-charcoal-800/70 mb-1">From Sender Address</label>
                    <input
                      type="email"
                      value={emailForm.fromEmail}
                      onChange={(e) => setEmailForm({ ...emailForm, fromEmail: e.target.value })}
                      placeholder="care@srianvaya.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-charcoal-800/70 mb-1">SMTP Host</label>
                    <input
                      type="text"
                      value={emailForm.smtpHost}
                      onChange={(e) => setEmailForm({ ...emailForm, smtpHost: e.target.value })}
                      placeholder="smtp.sendgrid.net"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-charcoal-800/70 mb-1">SMTP Port</label>
                    <input
                      type="text"
                      value={emailForm.smtpPort}
                      onChange={(e) => setEmailForm({ ...emailForm, smtpPort: e.target.value })}
                      placeholder="587"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-canvas text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => handleSaveService('email', emailForm)}
                    className="px-4 py-2 rounded-xl bg-maroon-700 text-white font-bold text-xs shadow-sm"
                  >
                    Save Email Hub
                  </button>
                  <button
                    onClick={() => handleTestService('email')}
                    className="px-3.5 py-2 rounded-xl border border-sand bg-canvas text-charcoal-800 font-bold text-xs"
                  >
                    Test Email Ping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NATIONAL HEADQUARTERS & GET IN TOUCH (DYNAMIC CONTACT MANAGER) */}
        {activeTab === 'CONTACT' && (
          <div className="space-y-8">
            <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-sand">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-maroon-100 text-maroon-800 flex items-center justify-center border border-gold-500/30">
                    <Building2 className="w-6 h-6 text-maroon-900" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-xl font-bold text-maroon-900">
                      National Headquarters & Public Contact Manager
                    </h3>
                    <p className="text-xs text-charcoal-800/70">
                      Super Admin control center to dynamically configure Headquarters title, operations address, support phone numbers, email inboxes, and website footer coordinates.
                    </p>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    try {
                      setSavingContact(true);
                      const res = await apiFetch('/settings/contact-info', {
                        method: 'PUT',
                        body: JSON.stringify(contactForm),
                      });
                      showNotification('success', res.message || 'National Headquarters and Contact coordinates updated successfully!');
                    } catch (err: any) {
                      showNotification('error', err.message);
                    } finally {
                      setSavingContact(false);
                    }
                  }}
                  disabled={savingContact}
                  className="px-6 py-3 rounded-2xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-md flex items-center space-x-2 shrink-0 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-gold-300" />
                  <span>{savingContact ? 'Saving Changes...' : 'Save Headquarters & Contact'}</span>
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Headquarters Info */}
                <div className="space-y-4 p-5 rounded-2xl bg-canvas border border-sand">
                  <h4 className="font-cinzel text-sm font-bold text-maroon-900 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-gold-600" />
                    <span>Headquarters Title & Coverage</span>
                  </h4>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-charcoal-800/70 mb-1">
                      Headquarters Section Title
                    </label>
                    <input
                      type="text"
                      value={contactForm.headquartersTitle}
                      onChange={(e) => setContactForm({ ...contactForm, headquartersTitle: e.target.value })}
                      placeholder="National Headquarters"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand bg-warmwhite text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-charcoal-800/70 mb-1">
                      Coverage & Service Area Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={contactForm.headquartersSubtitle}
                      onChange={(e) => setContactForm({ ...contactForm, headquartersSubtitle: e.target.value })}
                      placeholder="Serving Chennai, Bengaluru, Hyderabad, Mumbai, Delhi-NCR, and Overseas NRIs."
                      className="w-full px-4 py-2.5 rounded-xl border border-sand bg-warmwhite text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-charcoal-800/70 mb-1">
                      Operations Centre Subheading
                    </label>
                    <input
                      type="text"
                      value={contactForm.operationsCenterTitle}
                      onChange={(e) => setContactForm({ ...contactForm, operationsCenterTitle: e.target.value })}
                      placeholder="Operations Centre"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand bg-warmwhite text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-charcoal-800/70 mb-1">
                      Full Physical Headquarters Address
                    </label>
                    <textarea
                      rows={3}
                      value={contactForm.address}
                      onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                      placeholder="Heritage Arcade, North Mada Street, Mylapore, Chennai, TN 600004"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand bg-warmwhite text-xs leading-relaxed"
                    />
                  </div>
                </div>

                {/* 2. Communication Lines */}
                <div className="space-y-4 p-5 rounded-2xl bg-canvas border border-sand">
                  <h4 className="font-cinzel text-sm font-bold text-maroon-900 flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gold-600" />
                    <span>Hotline Numbers, Email & Hours</span>
                  </h4>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-charcoal-800/70 mb-1">
                      Direct Support Hotline (Phones)
                    </label>
                    <input
                      type="text"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="+91 98840 12345 / +91 44 2499 5500"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand bg-warmwhite text-xs font-semibold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-charcoal-800/70 mb-1">
                      Official Support Emails
                    </label>
                    <input
                      type="text"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="care@srianvaya.com / support@srianvaya.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand bg-warmwhite text-xs font-semibold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-charcoal-800/70 mb-1">
                      Operating Hours & Timings
                    </label>
                    <input
                      type="text"
                      value={contactForm.timings}
                      onChange={(e) => setContactForm({ ...contactForm, timings: e.target.value })}
                      placeholder="8 AM - 8 PM IST (Mon - Sun)"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand bg-warmwhite text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-charcoal-800/70 mb-1">
                      Footer Regional Centers (&quot;Get In Touch&quot;)
                    </label>
                    <textarea
                      rows={2}
                      value={contactForm.footerLocations}
                      onChange={(e) => setContactForm({ ...contactForm, footerLocations: e.target.value })}
                      placeholder="Mylapore / Bengaluru / Hyderabad (Expanding Pan-India & NRI Services)"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand bg-warmwhite text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="mt-8 p-6 rounded-2xl bg-charcoal-950 text-sand border border-charcoal-800 space-y-4">
                <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <span className="text-xs font-bold text-warmwhite uppercase tracking-wider">
                      Live Preview (How Visitors See This On Contact & Footer)
                    </span>
                  </div>
                  <span className="text-[10px] bg-gold-900/40 text-gold-300 px-2 py-0.5 rounded-full font-mono border border-gold-600/30">
                    Auto-Synced
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-charcoal-900/60 p-4 rounded-xl space-y-2 border border-charcoal-800">
                    <p className="font-bold text-gold-400 font-cinzel text-sm">{contactForm.headquartersTitle}</p>
                    <p className="text-[11px] text-sand/70">{contactForm.headquartersSubtitle}</p>
                    <p className="text-warmwhite pt-1 font-semibold flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>{contactForm.address}</span>
                    </p>
                    <p className="text-sand/80 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>{contactForm.timings}</span>
                    </p>
                  </div>

                  <div className="bg-charcoal-900/60 p-4 rounded-xl space-y-2 border border-charcoal-800">
                    <p className="font-bold text-gold-400 font-cinzel text-sm">Footer &quot;Get In Touch&quot;</p>
                    <p className="text-warmwhite font-semibold flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>{contactForm.footerLocations}</span>
                    </p>
                    <p className="text-warmwhite font-mono flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>{contactForm.phone}</span>
                    </p>
                    <p className="text-warmwhite font-mono flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span>{contactForm.email}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DATABASE BACKUP & RESTORE */}
        {activeTab === 'BACKUP' && (
          <div className="space-y-8">
            <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-sand">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-maroon-50 text-maroon-700 flex items-center justify-center">
                    <FileJson className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-xl font-bold text-maroon-900">
                      Full Database Snapshot & JSON Backup
                    </h3>
                    <p className="text-xs text-charcoal-800/70">
                      Export immutable snapshots of all users, pitru genealogies, events, and wallets, or restore from historical JSON backups.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleExportBackup}
                  className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center space-x-2 shrink-0 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup (.JSON)</span>
                </button>
              </div>

              {/* Collections Breakdown Stats */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-800/60 block mb-3">
                  Current Database Inventory Snapshot ({backupStats?.totalRecords || 0} Total Documents)
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {backupStats?.counts &&
                    Object.entries(backupStats.counts).map(([col, count]: [string, any]) => (
                      <div key={col} className="p-3.5 rounded-2xl bg-canvas border border-sand flex items-center justify-between">
                        <span className="font-bold text-charcoal-900 capitalize">{col}</span>
                        <span className="px-2 py-0.5 rounded-full bg-sand/70 font-mono font-extrabold text-[11px]">
                          {count}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Import & Restore Section */}
            <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-sand">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-maroon-900">
                    Restore Database from JSON Snapshot
                  </h3>
                  <p className="text-xs text-charcoal-800/70">
                    Upload a verified `.json` backup file to restore complete platform state.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border-2 border-dashed border-sand bg-canvas flex flex-col items-center justify-center text-center space-y-3">
                  <FileJson className="w-10 h-10 text-maroon-700" />
                  <div>
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs inline-block shadow-sm">
                      <span>Choose Backup File (.json)</span>
                      <input type="file" accept=".json" onChange={handleFileSelect} className="hidden" />
                    </label>
                  </div>
                  <p className="text-[11px] text-charcoal-800/60 font-mono">
                    {selectedBackupFile ? selectedBackupFile.name : 'Select a valid Sri Anvaya JSON backup file'}
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold uppercase text-charcoal-800/70 mb-1">Restore Mode</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 p-3 rounded-xl bg-canvas border border-sand cursor-pointer">
                        <input
                          type="radio"
                          name="restoreMode"
                          value="OVERWRITE"
                          checked={restoreMode === 'OVERWRITE'}
                          onChange={() => setRestoreMode('OVERWRITE')}
                          className="text-maroon-700"
                        />
                        <div>
                          <strong className="text-charcoal-900">OVERWRITE (Clean & Replace)</strong>
                          <p className="text-[10px] text-charcoal-800/60">Replaces current records with backup file content.</p>
                        </div>
                      </label>
                      <label className="flex items-center space-x-2 p-3 rounded-xl bg-canvas border border-sand cursor-pointer">
                        <input
                          type="radio"
                          name="restoreMode"
                          value="MERGE"
                          checked={restoreMode === 'MERGE'}
                          onChange={() => setRestoreMode('MERGE')}
                          className="text-maroon-700"
                        />
                        <div>
                          <strong className="text-charcoal-900">MERGE (Update & Append)</strong>
                          <p className="text-[10px] text-charcoal-800/60">Updates existing documents and appends new ones.</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button
                    disabled={!backupFileContent || isRestoring}
                    onClick={() => setShowRestoreModal(true)}
                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md disabled:opacity-40 transition-all"
                  >
                    {isRestoring ? 'Restoring Database...' : 'Review & Restore Snapshot'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BUSINESS & WELFARE RULES */}
        {activeTab === 'BUSINESS' && (
          <div className="bg-warmwhite rounded-3xl p-6 sm:p-8 border border-sand shadow-sm space-y-6">
            <h3 className="font-cinzel text-xl font-bold text-maroon-900 flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5 text-gold-600" />
              <span>Configurable Business & Welfare Parameters</span>
            </h3>

            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold uppercase text-charcoal-800/70 mb-1">
                  Provider Welfare Allocation Rate (%)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={welfarePercent}
                    onChange={(e) => setWelfarePercent(Number(e.target.value))}
                    className="w-32 px-4 py-2.5 rounded-xl border border-sand bg-canvas text-sm font-bold"
                  />
                  <span className="text-xs text-charcoal-800/70 font-semibold">
                    (Default: 12% deducted from gross Dakshina to Welfare Fund)
                  </span>
                </div>
              </div>

              <button
                onClick={async () => {
                  try {
                    await apiFetch('/settings', {
                      method: 'PUT',
                      body: JSON.stringify({ key: 'DEFAULT_WELFARE_PERCENTAGE', value: Number(welfarePercent) }),
                    });
                    showNotification('success', 'Business parameters successfully updated!');
                  } catch (err: any) {
                    showNotification('error', err.message);
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-md transition-all"
              >
                Update Business Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Restore */}
      <Modal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        title="Confirm Database Restoration"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
            <p className="font-bold">⚠️ Warning: Critical Operation</p>
            <p>
              You are about to restore the database using mode: <strong>{restoreMode}</strong> from file{' '}
              <strong>{selectedBackupFile?.name}</strong>.
            </p>
          </div>

          <p className="text-charcoal-800/80">
            This will update live records across Users, Customers, Families, Pitru Genealogies, Subscriptions, and Welfare Wallets.
          </p>

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => setShowRestoreModal(false)}
              className="flex-1 py-2.5 rounded-xl border border-sand bg-canvas text-charcoal-800 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteRestore}
              className="flex-1 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold shadow-md"
            >
              Execute Restore
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
