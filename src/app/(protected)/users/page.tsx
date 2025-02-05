"use client";

import { CreateEntityButton } from "@/components/custom/create-entity-button";
import { RegisterForm } from "./_components/features/create-user.component";
import { ListUsers } from "./_components/features/list-users.component";

/**
 * Page component responsible for displaying the users page.
 * @returns {JSX.Element} The JSX element representing the users page.
 */

export default function Page(): JSX.Element {
  return (
    <div>
      <CreateEntityButton
        title="Create User"
        dialog_content={<RegisterForm />}
        dialog_title="Create New User"
      />
      <ListUsers />
    </div>
  );
}
