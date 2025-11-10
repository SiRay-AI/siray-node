import { SirayClient } from '../src/index';

async function example() {
  const client = new SirayClient({
    apiKey: 'your-api-key-here',
  });

  try {
    // Asynchronous image generation example (recommended)
    console.log('Starting async image generation...');
    const imageResponse = await client.images.generateAsync({
      model: 'black-forest-labs/flux-1.1-pro-ultra-i2i',
      prompt: 'A beautiful sunset over mountains',
    });

    console.log('Image Task ID:', imageResponse.task_id);

    // Query image generation status
    let imageStatus = await client.images.queryTask(imageResponse.task_id);
    console.log('Image Status:', imageStatus.status);

    if (imageStatus.isCompleted()) {
      console.log('Generated Image URL:', imageStatus.result);
    }

    // Asynchronous video generation example
    console.log('Starting async video generation...');
    const videoResponse = await client.videos.generateAsync({
      model: 'your-video-model',
      prompt: 'A cat playing piano',
    });

    console.log('Video Task ID:', videoResponse.task_id);

    // Query video generation status
    let videoStatus = await client.videos.queryTask(videoResponse.task_id);
    console.log('Video Status:', videoStatus.status);

    if (videoStatus.isCompleted()) {
      console.log('Generated Video URL:', videoStatus.result);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

example();