import { useStore } from '../store/useStore';
import { Window } from './Window';
import { Desktop } from './Desktop';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { Dock } from './Dock';

export const OSContainer: React.FC = () => {
  const { windows } = useStore();

  return (
    <div className="os-container">
      <Desktop />

      <div className="windows-layer">
        {windows.map(window => (
          <Window key={window.id} window={window} />
        ))}
      </div>

      <StartMenu />
      <Taskbar />
      <Dock />
    </div>
  );
};
