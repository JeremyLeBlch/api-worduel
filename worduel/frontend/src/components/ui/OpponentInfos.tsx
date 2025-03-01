import React from 'react';
import DefaultAvatar from '../../assets/images/avatar.jpg';

interface OpponentInfosProps {
  username?: string;
  avatar?: string;
}

const OpponentInfos: React.FC<OpponentInfosProps> = ({ 
  username = "Player6743", 
  avatar 
}) => {
    return (
        <div className='flex flex-col items-center justify-center'>
            <img 
                src={`/images/${avatar}`} 
                alt={`avatar de ${username}`} 
                className="rounded-full h-14 w-14 object-cover" 
                onError={(e) => {
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.onerror = null;
                    imgElement.src = DefaultAvatar;
                }}
            />
            <p>{username}</p>
        </div>
    );
};

export default OpponentInfos;