declare module "mock-require" {
  interface MockRequire {
    (id: string, mock: unknown): void;
    reRequire(id: string): void;
    stop(id: string): void;
    stopAll(): void;
  }
  const mockRequire: MockRequire;
  export = mockRequire;
}
