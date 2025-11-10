import { SirayClient } from '../src';

async function runBlockingImageGeneration() {
  const client = new SirayClient({
    apiKey: 'your-api-key-here',
  });

  try {
    console.log('Submitting blocking image generation request...');
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
      console.log('Image ready at:', status.result);
    } else if (status.isFailed()) {
      console.error('Image generation failed:', status.fail_reason);
    } else {
      console.log('Image generation finished with status:', status.status);
    }
  } catch (error) {
    console.error('Blocking run failed:', error instanceof Error ? error.message : error);
  }
}

async function runBlockingVideoGeneration() {
  const client = new SirayClient({
    apiKey: 'your-api-key-here',
  });

  try {
    console.log('Submitting blocking video generation request...');
    const status = await client.videos.run(
      {
        model: 'your-video-model',
        prompt: 'A futuristic drone flying through neon-lit city streets',
      },
      {
        pollIntervalMs: 5000,
        timeoutMs: 10 * 60 * 1000,
      }
    );

    if (status.isCompleted()) {
      console.log('Video ready at:', status.result);
    } else if (status.isFailed()) {
      console.error('Video generation failed:', status.fail_reason);
    } else {
      console.log('Video generation finished with status:', status.status);
    }
  } catch (error) {
    console.error('Blocking run failed:', error instanceof Error ? error.message : error);
  }
}

async function main() {
  await runBlockingImageGeneration();
  await runBlockingVideoGeneration();
}

main().catch(console.error);
