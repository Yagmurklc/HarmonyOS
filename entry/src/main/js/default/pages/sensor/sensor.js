import app from '@system.app'
import router from '@system.router'
import sensor from '@system.sensor';
import storage from '@system.storage';
import device from '@system.device'

export default {
    data: {
        index: 0,
        heartBeatCount:'--',
        stepCounter:'--',
        i: 0.0,
        calorie: '0',
        saved: false,
        hearts: [
            {
                src: "/common/asserts/1.png",
            },
            {
                src: "/common/asserts/2.png",
            },
            {
                src: "/common/asserts/3.png",
            },

        ],

        steps: [
            {
                src: "/common/asserts/9.png",
            },
            {
                src: "/common/asserts/10.png",
            },
            {
                src: "/common/asserts/11.png",
            },
            {
                src: "/common/asserts/12.png",
            },
            {
                src: "/common/asserts/13.png",
            },

        ],
    },

    calculate () {
        let _this = this;
        this.getUserWeight('user_id')
        var s = parseFloat(this.stepCounter)
        var index = parseFloat(this.i)

        var c = (parseFloat(this.stepCounter) * index).toString()
        console.log(this.calorie);
    },

    touchMove(e) {  // Handle the swipe event.
        if(e.direction == "right") {
            this.appExit();
        }
    },

    handleStart() {
        this.$refs.animator.start();
    },

    handlePause() {
        this.$refs.animator.pause();
    },

    handleResume() {
        this.$refs.animator.resume();
    },

    handleStop() {
        this.$refs.animator.stop();
    },

    appExit(){  // Exit the application.
        app.terminate();
    },

    onInit() {
        let _this = this;
        // to listen the sensor wearing state, returns true if wear is in wrist
        sensor.subscribeOnBodyState({
            success: function(response) {
                console.log('get on-body state value:' + response.value);
                if(response.value === true) {
                    _this.getHeartBeatCount();
                    _this.getStepCount();
                }
            },
            fail: function(data, code) {
                console.log('fail to get on body state, code:' + code + ', data: ' + data);
            },
        });
    },

    getHeartBeatCount() {
        let _this = this;
        sensor.subscribeHeartRate({
            success: function(response) {
                console.log('get heart rate value:' + response.heartRate + ' BPM');
                _this.heartBeatCount = response.heartRate + ' BPM';
            },
            fail: function(data, code) {
                console.log('subscribe heart rate fail, code: ' + code + ', data: ' + data);
            },
        });
    },

    getStepCount() {
        let _this = this;
        sensor.subscribeStepCounter({
            success: function(response) {
                console.log('get step counter value:' + response.steps)
                _this.stepCounter = response.steps

            },
            fail: function(data, code) {
                console.log('subscribe step counter fail, code: ' + code + ', data' + data)
            }
        })
    },

    saveUserWeight: function (weight) {
        var that = this;
        console.log('weight:' + weight)
        that.setData('user_id', weight)
        that.getUserWeight('user_id')
    },

    getUserWeight(key) {
        var that = this
        storage.get({
            default: '0',
            key: key,
            success: function(data) {
                console.log('call storage.get success: ' + data)
                var d = data.valueOf()
                that.i = parseFloat(d)
                //that.index = parseFloat(data)
            },
            fail: function(data, code) {
                console.log('call storage.get fail, code: ' + code + ', data: ' + data);
            },
            complete: function() {
                console.log('call complete');
            },
        });
    },

    setData(key,value) {
        storage.set({
            key: key,
            value: value,

            success: function() {
                console.log('call storage.set success.');
            },
            fail: function(data, code) {
                console.log('call storage.set fail, code: ' + code + ', data: ' + data);
            },
        });
    },
}