import * as socket from 'socket.io'

export function initSocket( server ) {
    const io = socket(server);
    io.on('connection', client => {
        client.on('event', data => { /* … */ });
        client.on('disconnect', () => { /* … */ });
    });
    return io
}
