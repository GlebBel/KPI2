export interface TriggerConfig {
    every: number;
    data: any;
    queueName: string;
}


export interface WorkerConfig {
    queueName: string;
}
