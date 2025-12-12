import socketio
from typing import Dict, Any

# Créer le serveur Socket.io pour FastAPI
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',  # En production, spécifiez les domaines autorisés
    logger=True,
    engineio_logger=True
)

# Dictionnaire pour stocker les utilisateurs connectés
connected_users: Dict[str, str] = {}  # {sid: user_id}


@sio.event
async def connect(sid, environ, auth):
    """Gérer la connexion d'un client"""
    print(f"Client connected: {sid}")

    # Récupérer l'ID utilisateur si fourni
    if auth and 'user_id' in auth:
        connected_users[sid] = auth['user_id']
        print(f"User {auth['user_id']} connected with sid {sid}")

    await sio.emit('connection_established', {'sid': sid}, room=sid)


@sio.event
async def disconnect(sid):
    """Gérer la déconnexion d'un client"""
    if sid in connected_users:
        user_id = connected_users.pop(sid)
        print(f"User {user_id} disconnected (sid: {sid})")
    else:
        print(f"Client disconnected: {sid}")


@sio.event
async def join_room(sid, data):
    """Permettre à un utilisateur de rejoindre une room"""
    room = data.get('room')
    if room:
        await sio.enter_room(sid, room)
        print(f"Client {sid} joined room: {room}")


@sio.event
async def leave_room(sid, data):
    """Permettre à un utilisateur de quitter une room"""
    room = data.get('room')
    if room:
        await sio.leave_room(sid, room)
        print(f"Client {sid} left room: {room}")


async def emit_notification(notification_data: Dict[str, Any], room: str = None):
    """
    Émettre une notification à tous les clients connectés ou à une room spécifique

    Args:
        notification_data: Données de la notification {type, title, message, created_at}
        room: Nom de la room (optionnel). Si None, envoie à tous les clients
    """
    event_name = 'new_notification'

    if room:
        await sio.emit(event_name, notification_data, room=room)
        print(f"Notification sent to room {room}: {notification_data}")
    else:
        await sio.emit(event_name, notification_data)
        print(f"Notification broadcast to all clients: {notification_data}")


async def emit_event_created(event_data: Dict[str, Any]):
    """Émettre une notification pour un nouvel événement"""
    notification = {
        'type': 'event',
        'title': 'Nouvel événement',
        'message': f"L'événement '{event_data.get('title')}' a été créé !",
        'data': event_data
    }
    await emit_notification(notification)


async def emit_mentor_created(mentor_data: Dict[str, Any]):
    """Émettre une notification pour un nouveau mentor"""
    notification = {
        'type': 'mentor',
        'title': 'Nouveau mentorat',
        'message': f"Une nouvelle session de mentorat en {mentor_data.get('subject')} est disponible !",
        'data': mentor_data
    }
    await emit_notification(notification)


async def emit_classroom_created(classroom_data: Dict[str, Any]):
    """Émettre une notification pour une nouvelle salle"""
    notification = {
        'type': 'classroom',
        'title': 'Nouvelle salle',
        'message': f"La salle '{classroom_data.get('name')}' est maintenant disponible !",
        'data': classroom_data
    }
    await emit_notification(notification)
