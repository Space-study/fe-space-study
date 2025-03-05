import BackgoundItem from '@/core/components/customer/room/tools/Background/BackgroundItem';
import { setBackground } from '@/core/redux/slices/backgroundSlice';
import { backgroundService } from '@/core/services/room/background-service';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

interface BackgoundListProps {
  onCloseModal?: () => void;
}

interface Background {
  background_id?: number;
  name: string;
  image: string;
  isCustom: boolean;
}

const BackgoundList: React.FC<BackgoundListProps> = ({ onCloseModal }) => {
  const [backgroundListData, setBackgroundListData] = useState<Background[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadBackgrounds = async () => {
      try {
        const backgrounds = await backgroundService.getAllBackgrounds();
        const mappedBackgrounds = backgrounds.map(bg => ({
          background_id: bg.background_id,
          name: bg.title,
          image: bg.thumbnail_path,
          isCustom: false, // Adjust based on your API logic
        }));
        setBackgroundListData(mappedBackgrounds);
      } catch (error) {
        toast.error('Failed to load backgrounds');
        console.error(error);
      }
    };
    loadBackgrounds();
  }, []);

  const handleAddBackground = async (file: File) => {
    try {
      const newBackground = await backgroundService.createBackground({
        title: `Background ${backgroundListData.length + 1}`,
        file, // Pass the file directly
        description: 'Custom background',
        // category_id: 1, // Uncomment and set if needed
        // user_create_id will need to come from auth context if required
      });
      setBackgroundListData([
        ...backgroundListData,
        {
          background_id: newBackground.background_id,
          name: newBackground.title,
          image: newBackground.thumbnail_path,
          isCustom: true,
        },
      ]);
      toast.success('Added background successfully!');
    } catch (error) {
      toast.error('Failed to add background');
      console.error(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file.');
        return;
      }
      handleAddBackground(file);
    }
  };

  const handleSelectBackground = (name: string, image: string) => {
    dispatch(setBackground(image));
    toast.success(`Selected ${name} as background!`);
    if (onCloseModal) onCloseModal();
  };

  const handleDeleteBackground = async (backgroundId: number | undefined) => {
    if (!backgroundId) return;
    try {
      await backgroundService.deleteBackground(backgroundId);
      setBackgroundListData(backgroundListData.filter(bg => bg.background_id !== backgroundId));
      toast.success('Deleted background successfully!');
    } catch (error) {
      toast.error('Failed to delete background');
      console.error(error);
    }
  };

  return (
    <ul className="flex gap-2 flex-wrap overflow-y-auto max-h-[75vh] scroll-smooth items-center justify-center mt-6">
      {backgroundListData.map(bg => (
        <BackgoundItem
          key={bg.background_id || bg.name}
          backgroundId={bg.background_id}
          name={bg.name}
          image={bg.image}
          isCustom={bg.isCustom}
          onSelectBackground={handleSelectBackground}
          onDeleteBackground={() => handleDeleteBackground(bg.background_id)}
        />
      ))}
      <li className="cursor-pointer m-2 text-center transition-all duration-500 ease-in-out rounded-sm border">
        <label className="cursor-pointer relative top-1">
          <div className="relative h-[7rem] w-[12rem] p-1">
            <Image
              src="/default.jpg"
              alt="Add image"
              layout="fill"
              objectFit="cover"
              style={{ borderRadius: '0.5rem' }}
            />
          </div>
          <p className="text-sm pb-3 text-white">Add image</p>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      </li>
    </ul>
  );
};

export default BackgoundList;