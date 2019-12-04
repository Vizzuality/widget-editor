import { useState, useEffect } from "react";

import RwAdapter from "@packages/rw-adapter";

function useEditorHook(editor, setEditor) {
  const [loading, setLoading] = useState(true);

  const testAdapter = new RwAdapter(
    {
      applications: ["rw"],
      env: "production",
      locale: "en",
      includes: ["metadata", "vocabulary", "widget", "layer"]
    },
    "a86d906d-9862-4783-9e30-cdb68cd808b8"
  );

  useEffect(() => {
    if (loading) {
      testAdapter.resolveAdapterState(null).then(data => {
        setLoading(false);
        setEditor(data);
      });
    }
  }, [testAdapter, setEditor, setLoading, loading]);

  return [loading];
}

export default useEditorHook;
