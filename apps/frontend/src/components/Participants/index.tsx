import React from 'react';


interface ParticipantsProps {
    participants: {
        _id: string;
        name: string;
        socketId: string;
    }[]
}

const Participants: React.FC<ParticipantsProps> = ({ participants }: ParticipantsProps) => {
    console.log("Participants component received:", participants);
    return (
        <div className="participants-container flex flex-col gap-4">
            {participants.map((player) => (
                <div key={player._id} className="participant-item flex gap-4">
                    <img
                        width={30}
                        src={'https://cdn-icons-png.flaticon.com/512/219/219983.png'}
                        alt={`${player.name}'s avatar`}
                        className="participant-avatar"
                    />
                    <span className="participant-name">{player.name}</span>



                </div>
            ))}
        </div>

    );
};

export default Participants;