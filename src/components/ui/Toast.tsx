export function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div id="toast" className={`toast${visible ? ' is-visible' : ''}`} role="status">
      {message}
    </div>
  );
}
