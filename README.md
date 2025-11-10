# Siray Node.js SDK

Node.js SDK for Siray Image and Video Generation APIs.

## Installation

```bash
npm install siray
```

## Usage

```typescript
import { SirayClient } from 'siray';

const client = new SirayClient({
  apiKey: 'your-api-key-here',
});

// Asynchronous image generation (recommended)
const imageResponse = await client.images.generateAsync({
  model: 'black-forest-labs/flux-1.1-pro-ultra-i2i',
  prompt: 'A beautiful sunset over mountains',
});

// Asynchronous video generation
const videoResponse = await client.videos.generateAsync({
  model: 'your-video-model',
  prompt: 'A cat playing piano',
});
```

## API

### Image Generation

#### Asynchronous Generation (Recommended)

```typescript
// Start async generation
const response = await client.images.generateAsync({
  model: 'black-forest-labs/flux-1.1-pro-ultra-i2i',
  prompt: 'A beautiful sunset over mountains',
  image: 'https://api.siray.ai/redirect/BhSSiToAIXxA-MuSg68UCpJz_4M60hVkHPakChStzJ2PH7Nq-AgSUO0Wps-OlB4MtO2x7wbrwt7rxmd0get0ITR_5WeSCS8GjNoGDmiQOIjBSXc.jpg', // Optional for image-to-image
});

console.log('Task ID:', response.task_id);

// Query task status
const status = await client.images.queryTask(response.task_id);
if (status.isCompleted()) {
  console.log('Generated image:', status.result);
  console.log('All outputs:', status.outputs);
} else if (status.isFailed()) {
  console.log('Error:', status.fail_reason);
} else {
  console.log('Progress:', status.progress);
}
```

#### Synchronous Generation

```typescript
const response = await client.images.generate({
  model: string,
  prompt: string,
  n?: number,
  size?: string,
  response_format?: 'url' | 'b64_json',
});
```

### Video Generation

```typescript
// Start async video generation
const response = await client.videos.generateAsync({
  model: 'your-video-model',
  prompt: 'A cat playing piano',
});

console.log('Task ID:', response.task_id);

// Query task status
const status = await client.videos.queryTask(response.task_id);
if (status.isCompleted()) {
  console.log('Generated video:', status.result);
  console.log('All outputs:', status.outputs);
} else if (status.isFailed()) {
  console.log('Error:', status.fail_reason);
} else {
  console.log('Progress:', status.progress);
}
```

### Blocking Generation with `run`

If you prefer a blocking flow, use the `run` helper to submit an async task and wait until it finishes (or fails) without writing the polling loop yourself. Pass `BlockingRunOptions` to override the default 2s poll interval and 5‑minute timeout.

```typescript
const status = await client.images.run(
  {
    model: 'black-forest-labs/flux-1.1-pro-ultra-i2i',
    prompt: 'A cinematic portrait photo of a cyberpunk samurai',
  },
  {
    pollIntervalMs: 3000,
    timeoutMs: 3 * 60 * 1000,
  }
);

if (status.isCompleted()) {
  console.log('Generated image:', status.result);
} else if (status.isFailed()) {
  console.log('Error:', status.fail_reason);
} else {
  console.log('Final status:', status.status);
}

// Videos expose the same helper
const videoStatus = await client.videos.run({
  model: 'your-video-model',
  prompt: 'A cat playing piano',
});
```

See `examples/blocking-run.ts` for a complete script covering both image and video blocking runs.

## Error Handling

The SDK throws `SirayError` exceptions for API errors:

```typescript
import { SirayError } from 'siray';

try {
  const response = await client.chat.completions.create(options);
} catch (error) {
  if (error instanceof SirayError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Code:', error.code);
  }
}
```

## License

Licensed under the Apache License, Version 2.0. See the [`LICENSE`](./LICENSE) file for full details.
