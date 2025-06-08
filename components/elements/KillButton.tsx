import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import { SocketEvent } from '@/components/server/events';

import { Button } from '@/components/elements/button/index';
import { Dialog } from '@/components/elements/dialog';

const KillButton = () => {
    
    const [disabled, setDisabled] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const { connected, instance } = ServerContext.useStoreState((state) => state.socket);

    const checkStatus = (data: string) => {
        if (data === 'offline') {
            setDisabled(true);
            setConfirm(false);
        } else {
            setDisabled(false);
        }
    };

    useEffect(() => {
        if (!connected || !instance) return;
        instance.addListener(SocketEvent.STATUS, checkStatus);
    }, [connected, instance]);

    return (
        <>
        <Button.Danger disabled={disabled} className='ml-2' style={{ order: 4 }}  onClick={() => setConfirm(true)}>
            <span className='font-bold'>Kill</span>
        </Button.Danger>
            <Dialog.Confirm
                open={confirm}
                hideCloseIcon
                onClose={() => setConfirm(false)}
                title={'Forcibly Stop Process'}
                confirm={'Continue'}
                onConfirmed={() => { instance?.send('set state', ['kill']) }}
            >
                Forcibly stopping a server can lead to data corruption.
            </Dialog.Confirm>
        </>
    )
}

export default KillButton