import { StartService } from './start.service';

export function StartServiceFactory(startService: StartService): Function {
  return () => startService.load();
}
