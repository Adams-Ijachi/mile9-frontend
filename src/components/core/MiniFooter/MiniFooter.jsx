import './MiniFooter.css';

const MiniFooter = (props) => {
  return (
    <>
      <div {...props}>
        <div className="copyright">
          <p>Copyright © Mile9ine {new Date().getFullYear()}</p>
        </div>
      </div>
    </>
  );
}

export default MiniFooter;
