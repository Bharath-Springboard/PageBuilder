import { config } from 'packages/student/core/configs/asyncConfig';
import { ClientManager } from 'apps/frontend/ClientService/clientManager';
import { create } from 'apps/frontend/ClientService/createClient';

const domainList = ["student"]


export const clientProvider = () => {
  for (const domain of domainList) {
    create({ config, domain, manager: ClientManager.getInstance() });
  }
};