# Scout narration regressions

This suite runs Scout's actual `packages/llm/src/narrate.ts` bundled for Node. It is an application-boundary integration test, not a full live Graph/OpenSEO research run. No provider key or network service is needed.

```sh
npm ci --prefix .aurat
npm test --prefix .aurat
```

At baseline `d1aefb6face6d1ca7b78d3c55ef75ba40e05c62c`, the valid case passes but three malformed model responses are accepted: numeric summary, object action and non-string reasons. The same four fixtures pass after the validation fix. These are synthetic provider responses reproducing a defect in existing source; they are not captured production incidents.

Fixtures hold the actual HTTP request made by Scout plus controlled OpenAI-compatible responses. Aurat executes the bundled application function, consumes each fixture and asserts whether the function rejected the malformed narration. The workflow uploads its JSON report even when tests fail.
