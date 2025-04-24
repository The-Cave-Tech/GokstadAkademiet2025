"use client";

import { AccountAdministration } from "./sections/AccountAdministration";
import { LoginInfoManage } from "./sections/LoginInfoManage";
import { Notification } from "./sections/Notification";
import { PersonalInfo } from "./sections/PersonalInfo";
import { PublicProfile } from "./sections/PublicProfile";


export function ProfilePageContainer() {

    return (
        <section className="space-y-6">
          <PublicProfile />
          <PersonalInfo />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LoginInfoManage />
            <Notification />
          </div>
          <AccountAdministration />
        </section>
      );
    }