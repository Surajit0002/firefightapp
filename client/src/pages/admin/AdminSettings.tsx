
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Mail, 
  Globe, 
  Lock,
  CreditCard,
  Upload,
  AlertTriangle,
  CheckCircle,
  Save
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "Fire Fight Tournament",
    siteDescription: "Premier competitive gaming platform",
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    tournamentAutoApproval: false,
    maxTeamSize: 4,
    defaultTournamentFee: 50,
    platformCommission: 10,
    withdrawalMinAmount: 100,
    withdrawalMaxAmount: 10000,
    emailSettings: {
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUser: "",
      smtpPass: "",
      fromEmail: "noreply@firefight.com",
      fromName: "Fire Fight Tournament"
    },
    paymentSettings: {
      razorpayEnabled: true,
      paytmEnabled: false,
      upiEnabled: true,
      testMode: true
    },
    securitySettings: {
      twoFactorRequired: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8
    }
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings saved successfully",
        description: "All settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNestedSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Configure your platform settings</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxTeamSize">Max Team Size</Label>
                  <Input
                    id="maxTeamSize"
                    type="number"
                    value={settings.maxTeamSize}
                    onChange={(e) => updateSetting('maxTeamSize', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => updateSetting('siteDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Platform Controls</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-gray-600">Temporarily disable public access</p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="registrationEnabled">User Registration</Label>
                      <p className="text-sm text-gray-600">Allow new users to register</p>
                    </div>
                    <Switch
                      id="registrationEnabled"
                      checked={settings.registrationEnabled}
                      onCheckedChange={(checked) => updateSetting('registrationEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="tournamentAutoApproval">Tournament Auto-Approval</Label>
                      <p className="text-sm text-gray-600">Automatically approve new tournaments</p>
                    </div>
                    <Switch
                      id="tournamentAutoApproval"
                      checked={settings.tournamentAutoApproval}
                      onCheckedChange={(checked) => updateSetting('tournamentAutoApproval', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Send notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Send notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notification Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tournament Notifications</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="tournamentStart" defaultChecked />
                        <Label htmlFor="tournamentStart" className="text-sm">Tournament Start</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="tournamentEnd" defaultChecked />
                        <Label htmlFor="tournamentEnd" className="text-sm">Tournament End</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="tournamentResult" defaultChecked />
                        <Label htmlFor="tournamentResult" className="text-sm">Results Published</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>User Notifications</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="userRegistration" defaultChecked />
                        <Label htmlFor="userRegistration" className="text-sm">New Registration</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="walletTransaction" defaultChecked />
                        <Label htmlFor="walletTransaction" className="text-sm">Wallet Transactions</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="withdrawalRequest" defaultChecked />
                        <Label htmlFor="withdrawalRequest" className="text-sm">Withdrawal Requests</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultTournamentFee">Default Tournament Fee (₹)</Label>
                  <Input
                    id="defaultTournamentFee"
                    type="number"
                    value={settings.defaultTournamentFee}
                    onChange={(e) => updateSetting('defaultTournamentFee', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platformCommission">Platform Commission (%)</Label>
                  <Input
                    id="platformCommission"
                    type="number"
                    value={settings.platformCommission}
                    onChange={(e) => updateSetting('platformCommission', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="withdrawalMinAmount">Min Withdrawal (₹)</Label>
                  <Input
                    id="withdrawalMinAmount"
                    type="number"
                    value={settings.withdrawalMinAmount}
                    onChange={(e) => updateSetting('withdrawalMinAmount', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Gateways</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="razorpayEnabled">Razorpay</Label>
                      <p className="text-sm text-gray-600">Enable Razorpay payment gateway</p>
                    </div>
                    <Switch
                      id="razorpayEnabled"
                      checked={settings.paymentSettings.razorpayEnabled}
                      onCheckedChange={(checked) => updateNestedSetting('paymentSettings', 'razorpayEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="paytmEnabled">Paytm</Label>
                      <p className="text-sm text-gray-600">Enable Paytm payment gateway</p>
                    </div>
                    <Switch
                      id="paytmEnabled"
                      checked={settings.paymentSettings.paytmEnabled}
                      onCheckedChange={(checked) => updateNestedSetting('paymentSettings', 'paytmEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="upiEnabled">UPI</Label>
                      <p className="text-sm text-gray-600">Enable UPI payments</p>
                    </div>
                    <Switch
                      id="upiEnabled"
                      checked={settings.paymentSettings.upiEnabled}
                      onCheckedChange={(checked) => updateNestedSetting('paymentSettings', 'upiEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="testMode">Test Mode</Label>
                      <p className="text-sm text-gray-600">Enable test mode for payments</p>
                    </div>
                    <Switch
                      id="testMode"
                      checked={settings.paymentSettings.testMode}
                      onCheckedChange={(checked) => updateNestedSetting('paymentSettings', 'testMode', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.securitySettings.sessionTimeout}
                    onChange={(e) => updateNestedSetting('securitySettings', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.securitySettings.maxLoginAttempts}
                    onChange={(e) => updateNestedSetting('securitySettings', 'maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Password Min Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.securitySettings.passwordMinLength}
                    onChange={(e) => updateNestedSetting('securitySettings', 'passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorRequired">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Require 2FA for all admin users</p>
                  </div>
                  <Switch
                    id="twoFactorRequired"
                    checked={settings.securitySettings.twoFactorRequired}
                    onCheckedChange={(checked) => updateNestedSetting('securitySettings', 'twoFactorRequired', checked)}
                  />
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">Security Recommendations</span>
                </div>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                  <li>• Enable two-factor authentication for enhanced security</li>
                  <li>• Set session timeout to 30 minutes or less</li>
                  <li>• Use strong password requirements</li>
                  <li>• Regularly review admin access logs</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.emailSettings.smtpHost}
                    onChange={(e) => updateNestedSetting('emailSettings', 'smtpHost', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.emailSettings.smtpPort}
                    onChange={(e) => updateNestedSetting('emailSettings', 'smtpPort', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={settings.emailSettings.smtpUser}
                    onChange={(e) => updateNestedSetting('emailSettings', 'smtpUser', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPass">SMTP Password</Label>
                  <Input
                    id="smtpPass"
                    type="password"
                    value={settings.emailSettings.smtpPass}
                    onChange={(e) => updateNestedSetting('emailSettings', 'smtpPass', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.emailSettings.fromEmail}
                    onChange={(e) => updateNestedSetting('emailSettings', 'fromEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.emailSettings.fromName}
                    onChange={(e) => updateNestedSetting('emailSettings', 'fromName', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline">
                  Test Email Configuration
                </Button>
                <Button variant="outline">
                  Send Test Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-dashed">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Database Management</h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full">
                        <Database className="w-4 h-4 mr-2" />
                        Backup Database
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Restore Database
                      </Button>
                      <Button variant="outline" className="w-full">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Clear Cache
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-dashed">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">System Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Database Status</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Online
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Service</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Payment Gateway</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-sm font-medium text-red-800">Danger Zone</span>
                </div>
                <div className="mt-4 space-y-2">
                  <Button variant="destructive" size="sm">
                    Reset All Settings
                  </Button>
                  <Button variant="destructive" size="sm">
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
