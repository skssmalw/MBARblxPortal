import z from "zod";
import { MochaUser } from '@getmocha/users-service/shared';

export const RegimentSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  roblox_group_id: z.string().nullable(),
  roblox_group_url: z.string().nullable(),
  logo_url: z.string().nullable(),
  motto: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ApplicationSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  roblox_username: z.string(),
  discord_username: z.string().nullable(),
  age: z.number(),
  experience: z.string(),
  why_join: z.string(),
  availability: z.string(),
  previous_military: z.string().nullable(),
  status: z.string(),
  admin_notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Regiment = z.infer<typeof RegimentSchema>;
export type Application = z.infer<typeof ApplicationSchema>;

// Extended user type that includes admin status
export interface ExtendedMochaUser extends MochaUser {
  isAdmin: boolean;
}
