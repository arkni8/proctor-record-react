class UserMediaService {
    stream?: MediaStream;

    /**
   * The `USerMediaService` class in TypeScript initializes and manages the stream.
   */
    static streamInstance: UserMediaService;

    // constructor() {
    //     this.init();
    // }

    async init() {
        this.stream = await navigator.mediaDevices.getUserMedia({
            video: {
                frameRate: { ideal: 10, max: 15 },
                // width: { ideal: 720 },
                // height: { ideal: 480 },
                // aspectRatio: 16 / 9
            },
            audio: true,
        });
        console.log(this.stream);
    }

    /**
     * Returns a singleton instance of the UserMediaService class.
     * @returns {UserMediaService} Stream - The singleton instance of UserMediaService.
     */
    static getInstance() {
        if (!UserMediaService.streamInstance) {
            console.log("creating new instance for stream");
            UserMediaService.streamInstance = new UserMediaService();
        }
        console.log("using old instance");
        return UserMediaService.streamInstance;
    }
}


export default UserMediaService.getInstance;