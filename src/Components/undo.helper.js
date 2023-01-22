

export const onClickUndo = (events, setEvents) => {
    const lastEvent = events[events.length - 1];
    const undoEvents = events.slice(0, events.length - 1);
    setEvents(undoEvents);
    if(lastEvent.eventName === 'stencilImage') {
        for(let i = undoEvents.length - 1; i >= 0; i--) {
            if(undoEvents[i].eventName === 'stencilImage') { 
                if(undoEvents[i].id === lastEvent.id) {
                    const image = document.getElementById(undoEvents[i].id);
                    image.style.top = undoEvents[i].top;
                    image.style.left = undoEvents[i].left;
                    return;
                }
            }
        }
        document.getElementById(lastEvent.id).remove();
    } else if(lastEvent.eventName === 'image') {
        document.getElementById(lastEvent.data.id).remove();
    }
};