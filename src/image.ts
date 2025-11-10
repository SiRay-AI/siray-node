import { SirayClient } from './client';
import {
  BlockingRunOptions,
  ImageGenerationOptions,
  ImageGenerationResponse,
  TaskGenerationOptions,
  GenerationResponse,
  TaskStatus,
  SirayError,
} from './types';
import {
  GenerationResponseImpl,
  TaskStatusImpl,
  waitForTaskCompletion,
} from './task-utils';

export class Image {
  constructor(private client: SirayClient) {}

  async generate(options: ImageGenerationOptions): Promise<ImageGenerationResponse> {
    return this.client.post('/images/generations', options);
  }

  async generateAsync(options: TaskGenerationOptions): Promise<GenerationResponse> {
    const data = await this.client.post('/v1/images/generations/async', options);
    return new GenerationResponseImpl(data);
  }

  async queryTask(taskId: string): Promise<TaskStatus> {
    const data = await this.client.get(`/v1/images/generations/async/${taskId}`);
    return new TaskStatusImpl(data);
  }

  async run(
    options: TaskGenerationOptions,
    config: BlockingRunOptions = {}
  ): Promise<TaskStatus> {
    const response = await this.generateAsync(options);

    if (!response.task_id) {
      throw new SirayError('Task ID is missing from generation response');
    }

    return waitForTaskCompletion(this.queryTask.bind(this), response.task_id, config);
  }
}
