import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  CoreTeamAccessPreview,
  coreTeamFixtures,
} from "./core-team-access-preview";

const meta = {
  title: "Core/Team access",
  component: CoreTeamAccessPreview,
  args: { fixture: "members" },
  argTypes: { fixture: { control: "select", options: [...coreTeamFixtures] } },
  parameters: {
    layout: "fullscreen",
    visual: { fullscreen: true },
    docs: {
      description: {
        component:
          "Review team visibility, scoped assignments, roles and invitations in Configuración del negocio. Core responses and invitation delivery are simulated.",
      },
    },
  },
  render: (args) => <CoreTeamAccessPreview key={args.fixture} {...args} />,
} satisfies Meta<typeof CoreTeamAccessPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Members: Story = {};
export const DelegatedMembers: Story = {
  args: { fixture: "delegated-members" },
};
export const InviteOnly: Story = { args: { fixture: "invite-only" } };
export const AccessUnavailable: Story = {
  args: { fixture: "access-unavailable" },
};
export const Roles: Story = { args: { fixture: "roles" } };
export const NewRole: Story = { args: { fixture: "new-role" } };
export const AssignRole: Story = { args: { fixture: "assign-role" } };
export const EditMemberName: Story = { args: { fixture: "edit-member-name" } };
export const LastOwner: Story = { args: { fixture: "last-owner" } };
export const Invitations: Story = { args: { fixture: "invitations" } };
export const NewInvitation: Story = { args: { fixture: "new-invitation" } };
export const InvitationAccepted: Story = {
  args: { fixture: "invitation-accepted" },
};
export const NewInvitationWithRole: Story = {
  args: { fixture: "new-invitation-with-role" },
};
export const InvitationAcceptedWithRole: Story = {
  args: { fixture: "invitation-accepted-with-role" },
};
export const RoleEdit: Story = { args: { fixture: "role-edit" } };
export const RoleDelete: Story = { args: { fixture: "role-delete" } };
export const MemberRemoval: Story = { args: { fixture: "member-removal" } };
export const MembershipDeactivate: Story = {
  args: { fixture: "membership-deactivate" },
};
export const MembershipReactivate: Story = {
  args: { fixture: "membership-reactivate" },
};
export const AcceptInvitation: Story = {
  args: { fixture: "accept-invitation" },
};
export const InvitationExpired: Story = {
  args: { fixture: "invitation-expired" },
};
export const InvitationUnavailable: Story = {
  args: { fixture: "invitation-unavailable" },
};
export const InvitationUncertain: Story = {
  args: { fixture: "invitation-uncertain" },
};
export const ResendFailed: Story = { args: { fixture: "resend-failed" } };
export const ResendRefused: Story = { args: { fixture: "resend-refused" } };
export const TeamPaging: Story = { args: { fixture: "team-paging" } };
export const EmployeeAssignAccess: Story = {
  args: { fixture: "employee-assign-access" },
};
