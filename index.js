import axios from 'axios';

let eventsData = [];

async function getPhoto(uri) {
  const photo = await axios.get(
    `https://ucmerced-cdn.presence.io/event-photos/8fd48e04-025a-4b9c-9e7b-595adaeb479c/${uri}`
  );
  return photo;
}

function tagRemover(description) {
  return description.replace(/<\/?p[^>]*>/g, '');
}

axios
  .get(
    'https://api.presence.io/ucmerced/v1/organizations/events/association-for-computing-machinery-uc-merced'
  )
  .then(function (response) {
    // handle success
    Promise.all(
      response.data.map(async event => {
        console.log(event.uri, 'uri');
        let res;
        try {
          res = await axios.get(
            `https://api.presence.io/ucmerced/v1/events/${event.uri}`
          );
        } catch (err) {
          return err;
        }
        return res.data;
      })
    )
      .then(detailedEvents => {
        const formattedEvents = detailedEvents.map(event => {
          const formattedEvent = {
            apiID: event.apiId,
            eventName: event.eventName,
            description: tagRemover(event.description),
            location: event.isVirtualLink ? 'Virtual' : event.location,
            startTime: event.startDateTimeUtc,
            endTime: event.endDateTimeUtc,
            image: event.hasCoverImage ? event.photoUri : 'null',
          };
          return formattedEvent;
        });
        return formattedEvents;
      })
      .then(response => {
        eventsData = response;
        console.log(eventsData, 'eventsData');
      });
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
