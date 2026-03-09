'use client';

import React from 'react';
import { Clock, Play, Pause, Trash2, Edit } from 'lucide-react';
import { AutomationRule } from '@/types/device';
import { useDeviceStore } from '@/store/deviceStore';
import styles from './AutomationCard.module.css';

interface AutomationCardProps {
    automation: AutomationRule;
    onEdit?: (automation: AutomationRule) => void;
}

export default function AutomationCard({ automation, onEdit }: AutomationCardProps) {
    const { toggleAutomation, removeAutomation } = useDeviceStore();

    const getTriggerDescription = () => {
        switch (automation.trigger.type) {
            case 'time':
                return `At ${automation.trigger.time}`;
            case 'device_state':
                return `When device state changes`;
            case 'sensor_value':
                return `When sensor value changes`;
            default:
                return 'Manual trigger';
        }
    };

    return (
        <div className={`${styles.card} ${automation.enabled ? styles.enabled : ''}`}>
            <div className={styles.header}>
                <div className={styles.icon}>
                    <Clock size={20} />
                </div>
                <div className={styles.info}>
                    <h3 className={styles.name}>{automation.name}</h3>
                    <p className={styles.trigger}>{getTriggerDescription()}</p>
                </div>
                <div className={styles.status}>
                    {automation.enabled ? (
                        <span className={styles.badgeActive}>Active</span>
                    ) : (
                        <span className={styles.badgeInactive}>Inactive</span>
                    )}
                </div>
            </div>

            {automation.description && (
                <p className={styles.description}>{automation.description}</p>
            )}

            <div className={styles.actions}>
                <div className={styles.actionCount}>
                    {automation.actions.length} action{automation.actions.length !== 1 ? 's' : ''}
                </div>
                <div className={styles.buttons}>
                    <button
                        className={styles.btn}
                        onClick={() => toggleAutomation(automation.id)}
                        title={automation.enabled ? 'Disable' : 'Enable'}
                    >
                        {automation.enabled ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                        className={styles.btn}
                        onClick={() => onEdit?.(automation)}
                        title="Edit"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        className={`${styles.btn} ${styles.danger}`}
                        onClick={() => removeAutomation(automation.id)}
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
