import { Siray } from '../src/index';

async function imageGenerationExample() {
  const client = new Siray({
    apiKey: 'your-api-key-here',
  });

  try {
    // Asynchronous image generation (recommended)
    console.log('Starting async image generation...');
    const imageResponse = await client.image.generateAsync({
      model: 'black-forest-labs/flux-1.1-pro-ultra-i2i',
      prompt: 'A beautiful sunset over mountains',
      image: 'https://api.siray.ai/redirect/BhSSiToAIXxA-MuSg68UCpJz_4M60hVkHPakChStzJ2PH7Nq-AgSUO0Wps-OlB4MtO2x7wbrwt7rxmd0get0ITR_5WeSCS8GjNoGDmiQOIjBSXc.jpg', // Optional for image-to-image
    });

    console.log('Task ID:', imageResponse.task_id);

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      const status = await client.image.queryTask(imageResponse.task_id);

      console.log(`Attempt ${attempts + 1}: Status = ${status.status}, Progress = ${status.progress || 'N/A'}`);

      if (status.isCompleted()) {
        console.log('✅ Image generation completed!');
        console.log('Generated image:', status.result);
        console.log('All outputs:', status.outputs);
        break;
      } else if (status.isFailed()) {
        console.error('❌ Image generation failed:', status.fail_reason);
        break;
      }

      // Wait 2 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error:', message);
  }
}

async function videoGenerationExample() {
  const client = new Siray({
    apiKey: 'your-api-key-here',
  });

  try {
    // Asynchronous video generation
    console.log('Starting async video generation...');
    const videoResponse = await client.video.generateAsync({
      model: 'your-video-model',
      prompt: 'A cat playing piano',
    });

    console.log('Task ID:', videoResponse.task_id);

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 60; // Video generation takes longer

    while (attempts < maxAttempts) {
      const status = await client.video.queryTask(videoResponse.task_id);

      console.log(`Attempt ${attempts + 1}: Status = ${status.status}, Progress = ${status.progress || 'N/A'}`);

      if (status.isCompleted()) {
        console.log('✅ Video generation completed!');
        console.log('Generated video:', status.result);
        console.log('All outputs:', status.outputs);
        break;
      } else if (status.isFailed()) {
        console.error('❌ Video generation failed:', status.fail_reason);
        break;
      }

      // Wait 5 seconds before polling again (video takes longer)
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error:', message);
  }
}

async function main() {
  console.log('=== Image Generation Example ===');
  await imageGenerationExample();

  console.log('\n=== Video Generation Example ===');
  await videoGenerationExample();
}

// Run examples
main().catch(console.error);
