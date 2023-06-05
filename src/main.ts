import * as _path from 'path';
export enum SERVICE_KIND {
  DOCUMENTATION = 'DOCUMENTATION',
  STORE = 'STORE',
  SUPPLIER = 'SUPPLIER',
}

async function bootstrap() {
  const KIND = process.env.SERVICE_KIND;
  await runService(KIND as any);
}

const getPath = (name: string) => {
  return _path.join(__dirname, `./${name}/main`);
};

const runService = (type: SERVICE_KIND) => {
  switch (type) {
    case SERVICE_KIND.DOCUMENTATION:
      return import(getPath('documentation'));
    case SERVICE_KIND.STORE:
      return import(getPath('store'));
    case SERVICE_KIND.SUPPLIER:
      return import(getPath('supplier'));
    default:
      throw new Error('unknown service requested');
  }
};

bootstrap();
