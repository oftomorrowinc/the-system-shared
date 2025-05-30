export declare const AI_MODELS: (
  | {
      name: string;
      displayName: string;
      modelName: string;
      genkitName: string;
      provider: string;
      apiKeyName: string;
      modelType: string;
      firebaseFunction: string;
      contextWindow: number;
      inputCost: number;
      outputCost: number;
      temperature: {
        min: number;
        max: number;
        default: number;
        step: number;
      };
      topK: {
        min: number;
        max: number;
        default: number;
        step: number;
      };
      topP: {
        min: number;
        max: number;
        default: number;
        step: number;
      };
      maxOutputTokens: {
        min: number;
        max: number;
        default: number;
        step: number;
      };
      modeltName?: undefined;
      extraParameters?: undefined;
    }
  | {
      name: string;
      displayName: string;
      modeltName: string;
      genkitName: string;
      provider: string;
      apiKeyName: string;
      modelType: string;
      firebaseFunction: string;
      contextWindow: number;
      inputCost: number;
      outputCost: number;
      temperature: {
        min: number;
        max: number;
        default: number;
        step: number;
      };
      topK: {
        min: number;
        max: number;
        default: number;
        step: number;
      };
      topP: {
        min: number;
        max: number;
        default: number;
        step: number;
      };
      maxOutputTokens: {
        min: number;
        max: number;
        default: number;
        step: number;
      };
      extraParameters: (
        | {
            name: string;
            type: string;
            default: boolean;
            required: boolean;
            description: string;
            min?: undefined;
            max?: undefined;
            step?: undefined;
          }
        | {
            name: string;
            type: string;
            default: number;
            min: number;
            max: number;
            required: boolean;
            description: string;
            step: number;
          }
      )[];
      modelName?: undefined;
    }
  | {
      name: string;
      displayName: string;
      modelName: string;
      genkitName: string;
      provider: string;
      apiKeyName: string;
      modelType: string;
      firebaseFunction: string;
      contextWindow: number;
      inputCost: number;
      outputCost: number;
      temperature: {
        min: number;
        max: number;
        default: number;
        step: number;
      };
      topK: {
        min: number;
        max: number;
        default: number;
        step: number;
      };
      topP: {
        min: number;
        max: number;
        default: number;
        step: number;
      };
      maxOutputTokens: {
        min: number;
        max: number;
        default: number;
        step: number;
      };
      extraParameters: (
        | {
            name: string;
            type: string;
            default: number;
            min: number;
            max: number;
            required: boolean;
            description: string;
            step: number;
            options?: undefined;
          }
        | {
            name: string;
            type: string;
            default: string;
            options: string[];
            required: boolean;
            description: string;
            min?: undefined;
            max?: undefined;
            step?: undefined;
          }
        | {
            name: string;
            type: string;
            default: string;
            required: boolean;
            description: string;
            min?: undefined;
            max?: undefined;
            step?: undefined;
            options?: undefined;
          }
        | {
            name: string;
            type: string;
            default: boolean;
            required: boolean;
            description: string;
            min?: undefined;
            max?: undefined;
            step?: undefined;
            options?: undefined;
          }
      )[];
      modeltName?: undefined;
    }
)[];
