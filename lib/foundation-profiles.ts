import {
  Anchor,
  Cpu,
  EyeOff,
  Fingerprint,
  Landmark,
  Radar,
  Scale,
  ScanLine,
  Shield,
  Stethoscope,
  Wrench,
  Zap,
} from "lucide-react";
import type { DossierProfile } from "@/components/character-dossier";

export const foundationProfiles = [
  {
    id: "michael-knight",
    name: "Michael Knight",
    role: "Field operative",
    statement: "A man who does not exist",
    biography: "Presumed dead. Rebuilt with a new face, name, and purpose.",
    avatar: "/poster-driver.avif",
    avatarAlt: "Profile silhouette of Michael Knight",
    poster: "/poster-driver-alt.avif",
    posterAlt: "Neon silhouette of Michael Knight",
    traits: [
      {
        icon: Radar,
        label: "Instinct",
        detail: "Reads people before they speak",
      },
      { icon: Fingerprint, label: "Cover", detail: "The man the world buried" },
      {
        icon: Anchor,
        label: "Resolve",
        detail: "Never leaves a partner behind",
      },
    ],
  },
  {
    id: "bonnie-barstow",
    name: "Bonnie Barstow",
    role: "Systems engineer",
    statement: "The mind behind the machine",
    biography: "Keeps K.I.T.T. evolving and both partners alive in the field.",
    avatar: "/poster-mechanic.avif",
    avatarAlt: "Profile silhouette of Bonnie Barstow",
    poster: "/poster-mechanic-alt.avif",
    posterAlt: "Neon silhouette of Bonnie Barstow",
    traits: [
      {
        icon: Wrench,
        label: "Engineering",
        detail: "Rebuilt K.I.T.T. more than once",
      },
      {
        icon: Stethoscope,
        label: "Diagnostics",
        detail: "Hears a fault before it fails",
      },
      {
        icon: Zap,
        label: "Nerve",
        detail: "Works while the engine is running",
      },
    ],
  },
  {
    id: "kitt",
    name: "K.I.T.T.",
    role: "Knight Industries Two Thousand",
    statement: "Intelligence and force",
    biography:
      "An independent mind, a dry wit, and an unshakable loyalty. Michael's partner in the field — with the power to get them both home.",
    avatar: "/avatar-kitt.avif",
    avatarAlt: "K.I.T.T.'s red scanner glowing beneath neon bands",
    poster: "/poster-kitt.avif",
    posterAlt: "Neon silhouette of K.I.T.T. head-on with its red scanner lit",
    traits: [
      { icon: Cpu, label: "Intelligence", detail: "Self-aware neural system" },
      { icon: Shield, label: "Shell", detail: "Molecular bonded armor" },
      { icon: ScanLine, label: "Scanner", detail: "Anamorphic equalizer" },
    ],
  },
  {
    id: "devon-miles",
    name: "Devon Miles",
    role: "Foundation director",
    statement: "The conscience behind the mission",
    biography:
      "Runs the Foundation for Law and Government from behind a desk and a telephone. Knows who Michael was.",
    avatar: "/poster-director.avif",
    avatarAlt: "Silhouette of Devon Miles at his desk",
    poster: "/poster-director-alt.avif",
    posterAlt: "Neon silhouette of Devon Miles behind his desk",
    traits: [
      { icon: Landmark, label: "Command", detail: "Directs every mission" },
      {
        icon: Scale,
        label: "Conscience",
        detail: "Draws the line the Foundation will not cross",
      },
      {
        icon: EyeOff,
        label: "Discretion",
        detail: "Keeps the secrets that keep Michael alive",
      },
    ],
  },
] as const satisfies readonly DossierProfile[];
