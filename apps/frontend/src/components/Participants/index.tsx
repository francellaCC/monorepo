import React from 'react';

interface Participant {
    id: string;
    name: string;
    avatar?: string;
}

interface ParticipantsProps {
    participants: Participant[];
}

const Participants: React.FC<ParticipantsProps> = ({ participants }) => {
    return (
        <div className="participants-container flex flex-col gap-4">
            {participants.map((participant) => (
                <div key={participant.id} className="participant-item flex gap-4">
                    <img
                        width={30}
                        src={participant.avatar || 'https://cdn-icons-png.flaticon.com/512/219/219983.png'}
                        alt={`${participant.name}'s avatar`}
                        className="participant-avatar"
                    />
                    <span className="participant-name">{participant.name}</span>
                </div>
            ))}
        </div>
    );
};

export default Participants;