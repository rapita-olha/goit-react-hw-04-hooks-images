import errorImg from 'components/ImageGallery/ErrorView/error-img.png';

export default function ErrorView() {
  return (
    <div style={{ paddingTop: '100px' }}>
      <img
        src={errorImg}
        alt="welcome"
        width={700}
        style={{ margin: '0 auto' }}
      />
    </div>
  );
}
