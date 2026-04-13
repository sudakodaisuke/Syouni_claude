'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getDeviceId, setDeviceId } from '@/lib/localStorage';

export function useDeviceId(): string {
  const [deviceId, setDeviceIdState] = useState<string>('');

  useEffect(() => {
    let id = getDeviceId();
    if (!id) {
      id = uuidv4();
      setDeviceId(id);
    }
    setDeviceIdState(id);
  }, []);

  return deviceId;
}
