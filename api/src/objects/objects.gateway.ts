import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ObjectsGateway {
  @WebSocketServer()
  server: Server;

  emitObjectCreated(object: any) {
    this.server.emit('object:created', object);
  }

  emitObjectDeleted(id: string) {
    this.server.emit('object:deleted', id);
  }
}
