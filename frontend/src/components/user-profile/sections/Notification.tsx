"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { useState } from "react";
import ToggleSwitch from "@/components/ui/custom/ToogleSwith";

export function Notification() {
  const [formData, setFormData] = useState({
    importantUpdates: true,
    newsletter: true
  });

  const handleToggleChange = (settingName, enabled) => {
    setFormData(prev => ({
      ...prev,
      [settingName]: enabled
    }));
    
    // Her kunne vi hatt et API-kall for å lagre endringen direkte
    console.log(`Endret ${settingName} til ${enabled}`);
  };

  return (
    <Card className="w-full bg-[rgb(245,238,231)]">
      <CardHeader className="flex items-center gap-3 rounded-md">
        <figure className="w-10 h-10 rounded-full bg-[#d1d1d1] flex items-center justify-center">
          <span className="text-black text-xl" aria-hidden="true">🔔</span>
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
        <div className="space-y-6">
          {/* E-postvarsler */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-700">E-postvarsler</h3>
              <p className="text-sm text-gray-600">Motta viktige oppdateringer på e-post</p>
            </div>
            <ToggleSwitch
              enabled={formData.importantUpdates}
              onChange={(enabled) => handleToggleChange('importantUpdates', enabled)}
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
              onChange={(enabled) => handleToggleChange('newsletter', enabled)}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}