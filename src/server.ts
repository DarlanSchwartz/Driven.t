import { hotelRepository } from './repositories/hotels-repository';
import app, { init } from '@/app';

const port = +process.env.PORT || 4000;

init().then(() => {
  app.listen(port, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Server is listening on port ${port}.`);
  });

  (async () => {
    const hotel = await hotelRepository.getHotelWithRooms(46);
    console.log(hotel);
  })();
});
