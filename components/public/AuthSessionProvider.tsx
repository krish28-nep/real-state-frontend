"use client";

import { useEffect } from "react";
import { restoreSession } from "@/lib/axios";

export default function AuthSessionProvider() {
  useEffect(() => {
    void restoreSession();
  }, []);

  return null;
}
