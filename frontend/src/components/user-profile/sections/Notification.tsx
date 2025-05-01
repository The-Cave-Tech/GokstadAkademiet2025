"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useState, useEffect } from "react";
import ToggleSwitch from "@/components/ui/custom/ToogleSwith";
import PageIcons from "@/components/ui/custom/PageIcons";
import { UserProfile } from "@/lib/data/services/userProfile";
import { updateImportantUpdates, updateNewsletter } from "@/lib/data/services/profileSections/notificationService";
import { 
  NotificationProps, 
  NotificationFormData, 
  NotificationLoadingStates 
} from "@/types/notificationSettings.types";

export function Notification({ profile, onProfileUpdate = () => {} }: NotificationProps) {
  const [formData, setFormData] = useState<NotificationFormData>({
    importantUpdates: false,
    newsletter: false
  });
  
  const [toggleLoadingStates, setToggleLoadingStates] = useState<NotificationLoadingStates>({
    importantUpdates: false,
    newsletter: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hent innstillinger når komponenten lastes
  useEffect(() => {
    const initializeNotificationSettings = async () => {
      try {
        setLoading(true);
        if (profile && profile.notificationSettings) {
          setFormData({
            importantUpdates: profile.notificationSettings.importantUpdates || false,
            newsletter: profile.notificationSettings.newsletter || false
          });
        }
        setError(null);
      } catch (err) {
        console.error("Feil ved initialisering av notifikasjonsinnstillinger:", err);
        setError("Kunne ikke laste notifikasjonsinnstillinger");
      } finally {
        setLoading(false);
      }
    };

    initializeNotificationSettings();
  }, [profile]);

  const handleToggleChange = (settingName: keyof NotificationFormData) => async (enabled: boolean) => {
    setToggleLoadingStates(prev => ({
      ...prev,
      [settingName]: true
    }));
    
    try {
      let response;
      if (settingName === 'importantUpdates') {
        response = await updateImportantUpdates(enabled);
      } else if (settingName === 'newsletter') {
        response = await updateNewsletter(enabled);
      }
      
      if (response) {
        setFormData(prev => ({
          ...prev,
          [settingName]: enabled
        }));
        if (onProfileUpdate && profile) {
          const updatedProfile = { ...profile } as UserProfile;
          if (!updatedProfile.notificationSettings) {
            updatedProfile.notificationSettings = {};
          }
          updatedProfile.notificationSettings[settingName] = enabled;
          onProfileUpdate(updatedProfile);
        }
      }
      
      console.log(`Endret ${settingName} til ${enabled}`);
      setError(null);
    } catch (error) {
      console.error(`Feil ved oppdatering av ${settingName}:`, error);
      setError(`Kunne ikke oppdatere ${settingName}`);
      setFormData(prev => ({
        ...prev,
        [settingName]: !enabled
      }));
    } finally {
      setToggleLoadingStates(prev => ({
        ...prev,
        [settingName]: false
      }));
    }
  };

  if (loading) {
    return (
      <Card className="w-full bg-[rgb(245,238,231)]">
        <CardBody>
          <div className="flex justify-center items-center p-8">
            <span className="text-gray-600">Laster notifikasjonsinnstillinger...</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-[rgb(245,238,231)]">
      <CardHeader className="flex items-center gap-3 rounded-md">
        <figure className="w-10 h-10 rounded-full bg-[#d1d1d1] flex items-center justify-center">
          <PageIcons name="notification" directory="profileIcons" size={24} alt="Varslingsinnstillinger" />
          <figcaption className="sr-only">Ikon for varslingsinnstillinger</figcaption>
        </figure>
        <div>
          <h2 className="text-base font-medium text-gray-900">
            Varslingsinnstillinger
          </h2>
          <p className="text-sm text-gray-600">
            Hvordan vil du bli kontaktet?
          </p>
        </div>
      </CardHeader>

      <CardBody className="pt-5 px-4 rounded-md">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-700">E-postvarsler</h3>
              <p className="text-sm text-gray-600">Motta viktige oppdateringer på e-post</p>
            </div>
            <ToggleSwitch
              enabled={formData.importantUpdates}
              onChange={handleToggleChange('importantUpdates')}
              isLoading={toggleLoadingStates.importantUpdates}
            />
          </div>
          
          <hr className="border-gray-300" />
          
          {/* Markedsføring */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-700">Markedsføring</h3>
              <p className="text-sm text-gray-600">Motta nyheter og tilbud fra oss</p>
            </div>
            <ToggleSwitch
              enabled={formData.newsletter}
              onChange={handleToggleChange('newsletter')}
              isLoading={toggleLoadingStates.newsletter}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}