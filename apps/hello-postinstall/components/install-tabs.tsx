"use client";

import * as React from "react";

import { CopyButton } from "@/components/copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_PACKAGE_MANAGER, PACKAGE_MANAGERS } from "@/lib/utils";

export function InstallTabs() {
  return (
    <Tabs defaultValue={DEFAULT_PACKAGE_MANAGER} className="w-full">
      <TabsList>
        {PACKAGE_MANAGERS.map((pm) => (
          <TabsTrigger key={pm.id} value={pm.id}>
            {pm.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {PACKAGE_MANAGERS.map((pm) => (
        <TabsContent key={pm.id} value={pm.id}>
          <div className="relative">
            <pre className="overflow-x-auto rounded-md border border-border bg-muted py-3 pl-4 pr-12 font-mono text-sm">
              <code>{pm.command}</code>
            </pre>
            <CopyButton
              value={pm.command}
              label={`Copy ${pm.label} install command`}
              className="absolute right-1.5 top-1/2 -translate-y-1/2"
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
