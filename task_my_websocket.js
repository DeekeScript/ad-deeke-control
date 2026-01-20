let tCommon = require('app/dy/Common.js');
let DyIndex = require('app/dy/Index.js');
let DyVideo = require('app/dy/Video.js');
let DySearch = require('app/dy/Search.js');
let DyUser = require('app/dy/User.js');
let DyComment = require('app/dy/Comment.js');
let storage = require('common/storage.js');
let machine = require('common/machine.js');

/**
 {
    "type": "task",
    "task_id": 7,
    "key": "like_video",
    "name": "测试7",
    "task_data": {
        "video_url": "https://v.douyin.com/rE39CfNc2cM/"
    },
    "reserve": false
}
 */

let task = {
    backCount: 5,
    run(taskData) {
        return this.testTask(taskData);
    },

    back(i) {
        for (let j = 0; j < i; j++) {
            tCommon.back();
            tCommon.sleep(500);
        }
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-task-my-websocket-" + file + ".txt";
        Log.setFile(allFile);
    },

    likeVideo(taskData, type) {
        Log.log('开始执行点赞视频任务', taskData.task_data.video_url);
        tCommon.openApp();
        DyIndex.intoHome();

        App.openUrl(tCommon.getUrl(taskData.task_data.video_url), tCommon.packageName());
        tCommon.sleep(7000);
        if (type === 0 && DyVideo.isZan()) {
            Log.log('视频已点赞');
            return true;
        }

        if (type === 1 && !DyVideo.isZan()) {
            Log.log('视频未点赞');
            return true;
        }

        return DyVideo.clickZan();
    },

    focus(taskData, type) {
        tCommon.openApp();
        DyIndex.intoHome();
        tCommon.sleep(7000);
        DyIndex.intoSearchPage();
        DySearch.intoSearchList(taskData.task_data.account, 1);
        DySearch.intoSeachUser(taskData.task_data.account);
        tCommon.sleep(3000);
        task.backCount = 7;

        if (type === 0) {
            if (DyUser.isFocus()) {
                Log.log('已关注');
                return true;
            }
            return DyUser.focus();
        }

        if (!DyUser.isFocus()) {
            return true;
        }
        return DyUser.cancelFocus();
    },

    private(taskData) {
        tCommon.openApp();
        DyIndex.intoHome();
        tCommon.sleep(7000);
        DyIndex.intoSearchPage();
        DySearch.intoSearchList(taskData.task_data.account, 1);
        DySearch.intoSeachUser(taskData.task_data.account);
        tCommon.sleep(3000);
        task.backCount = 7;

        return DyUser.privateMsg(taskData.task_data.message);
    },

    reportAccount(taskData) {
        tCommon.openApp();
        DyIndex.intoHome();
        tCommon.sleep(7000);
        DyIndex.intoSearchPage();
        DySearch.intoSearchList(taskData.task_data.account, 1);
        DySearch.intoSeachUser(taskData.task_data.account);
        tCommon.sleep(3000);
        task.backCount = 7;
        return DyUser.reportUser(taskData.task_data.category_label, taskData.task_data.subcategory_label, taskData.task_data.content, taskData.task_data);
    },

    reportVideo(taskData) {
        Log.log('开始执行点赞视频任务', taskData.task_data.video_url);
        tCommon.openApp();
        DyIndex.intoHome();
        App.openUrl(tCommon.getUrl(taskData.task_data.video_url), tCommon.packageName());
        tCommon.sleep(7000);

        Gesture.press(300, 800, 800);
        System.sleep(3000);
        return DyVideo.reportVideo(taskData.task_data.category_label, taskData.task_data.subcategory_label, taskData.task_data.content, taskData.task_data);
    },

    collectVideo(taskData, type) {
        Log.log('开始执行视频任务', taskData.task_data.video_url);
        tCommon.openApp();
        DyIndex.intoHome();
        App.openUrl(tCommon.getUrl(taskData.task_data.video_url), tCommon.packageName());
        tCommon.sleep(7000);

        if (type === 0 && DyVideo.isCollect()) {
            Log.log('视频已收藏');
            return true;
        }

        if (type === 1 && !DyVideo.isCollect()) {
            Log.log('视频未收藏');
            return true;
        }

        let res = DyVideo.collect();
        tCommon.sleep(3000);
        return res;
    },

    commentVideo(taskData) {
        Log.log('开始执行视频任务', taskData.task_data.video_url);
        tCommon.openApp();
        DyIndex.intoHome();
        App.openUrl(tCommon.getUrl(taskData.task_data.video_url), tCommon.packageName());
        tCommon.sleep(7000);
        let res = DyComment.commentMsg(taskData.task_data.comment);
        tCommon.sleep(3000);
        return res;
    },

    likeComment(taskData, type) {
        Log.log('开始执行视频任务', taskData.task_data.video_url);
        tCommon.openApp();
        DyIndex.intoHome();
        App.openUrl(tCommon.getUrl(taskData.task_data.video_url), tCommon.packageName());
        tCommon.sleep(7000);
        DyComment.intoShareVideoComment();
        let res = DyComment.zanShareVideoComment(type);
        tCommon.sleep(3000);
        return res;
    },

    shareVideo(taskData) {
        Log.log('开始执行视频任务', taskData.task_data.video_url);
        tCommon.openApp();
        DyIndex.intoHome();
        App.openUrl(tCommon.getUrl(taskData.task_data.video_url), tCommon.packageName());
        tCommon.sleep(7000);

        tag = UiSelector().descContains('分享').isVisibleToUser(true).findOne();
        tCommon.click(tag);

        tCommon.sleep(3000);
        tag = UiSelector().textContains('转发到日常').isVisibleToUser(true).findOne();
        tCommon.click(tag);

        tCommon.sleep(3000);
        tag = UiSelector().text('转发').isVisibleToUser(true).findOne();
        let res = tCommon.click(tag);
        tCommon.sleep(10000);
        Log.log('分享完成');
        return res;
    },

    dislikeComment(taskData, type) {
        Log.log('开始执行视频任务', taskData.task_data.video_url);
        tCommon.openApp();
        DyIndex.intoHome();
        App.openUrl(tCommon.getUrl(taskData.task_data.video_url), tCommon.packageName());
        tCommon.sleep(7000);
        DyComment.intoShareVideoComment();
        let res = DyComment.caiShareVideoComment(type);
        tCommon.sleep(3000);
        return res;
    },

    replyComment(taskData) {
        Log.log('开始执行视频任务', taskData.task_data.video_url);
        tCommon.openApp();
        DyIndex.intoHome();
        task.backCount = 3;
        App.openUrl(tCommon.getUrl(taskData.task_data.video_url), tCommon.packageName());
        tCommon.sleep(7000);

        DyComment.intoShareVideoComment();
        tag = UiSelector().text('回复').isVisibleToUser(true).findOne();
        console.log(tag);
        tCommon.click(tag);

        System.sleep(3000);
        let iptTag = UiSelector().className('android.widget.EditText').isVisibleToUser(true).editable(true).findOne();
        iptTag.setText(taskData.task_data.reply_comment);
        tCommon.sleep(2000);

        let btnTag = UiSelector().textContains('发送').isVisibleToUser(true).findOne();
        let res = btnTag.parent().click();
        tCommon.sleep(3000);
        return res;
    },

    reportComment(taskData) {
        Log.log('开始执行视频任务', taskData.task_data.video_url);
        tCommon.openApp();
        DyIndex.intoHome();
        task.backCount = 3;
        App.openUrl(tCommon.getUrl(taskData.task_data.video_url), tCommon.packageName());
        tCommon.sleep(7000);

        DyComment.intoShareVideoComment();
        return DyVideo.reportComment(taskData.task_data.category_label, taskData.task_data);
    },

    toJson: false,

    testTask(taskData) {
        //首先进入点赞页面
        if (taskData.task_data && !this.toJson) {
            taskData.task_data = JSON.parse(taskData.task_data);
            this.toJson = true;
        }

        if (taskData.key === 'like_video') {
            return this.likeVideo(taskData, 0);
        }

        if (taskData.key === 'unlike_video') {
            return this.likeVideo(taskData, 1);
        }

        if (taskData.key === 'follow') {
            return this.focus(taskData, 0);
        }

        if (taskData.key === 'unfollow') {
            return this.focus(taskData, 1);
        }

        if (taskData.key === 'private_message') {
            return this.private(taskData);
        }

        if (taskData.key === 'report_account') {
            return this.reportAccount(taskData);
        }

        if (taskData.key === 'report_video') {
            return this.reportVideo(taskData);
        }

        if (taskData.key === 'collect_video') {
            return this.collectVideo(taskData, 0);
        }

        if (taskData.key === 'comment_video') {
            return this.commentVideo(taskData);
        }

        if (taskData.key === 'like_comment') {
            return this.likeComment(taskData, 0);
        }

        if (taskData.key === 'unlike_comment') {
            return this.likeComment(taskData, 1);
        }

        if (taskData.key === 'share_video') {
            return this.shareVideo(taskData);
        }

        if (taskData.key === 'dislike_comment') {
            return this.dislikeComment(taskData, 0);
        }

        if (taskData.key === 'undislike_comment') {
            return this.dislikeComment(taskData, 1);
        }

        if (taskData.key === 'reply_comment') {
            return this.replyComment(taskData);
        }

        if (taskData.key === 'report_comment') {
            return this.reportComment(taskData);
        }

        //系统指令
        if (taskData.key === 'system_screen_off') {
            DeviceHardware.setKeyguardDisabled(true);//关闭锁屏界面
            return DevicePolicy.lockNow();//息屏
        }

        if (taskData.key === 'system_screen_on') {
            let res = DevicePolicy.wakeScreen();
            DeviceHardware.setKeyguardDisabled(true);
            return res;
        }

        if (taskData.key === 'system_close_douyin') {
            DeviceApp.setApplicationHidden(tCommon.packageName(), true);
            System.sleep(3000);
            return DeviceApp.setApplicationHidden(tCommon.packageName(), false);
        }

        if (taskData.key === 'system_clear_gallery') {
            console.log('开始清理相册图片');
            return tCommon.clearGallery();
        }

        if (taskData.key === 'system_upgrade_app') {
            let res = Http.post(DeekeScript.getHost() + '/api/dke/updateApp', {
                version: App.currentVersionCode(),
            });

            res = JSON.parse(res);
            console.log('升级结果', res);
            if (res.data && res.data.downloadUrl) {
                let file = Files.getCachePath() + "/app.apk.png";
                Log.log('下载文件到', file);
                res = Http.download(res.data.downloadUrl, file);
                Log.log('下载结果', res);
                if (res) {
                    let res = DeviceApp.installPackage(file);
                    console.log('安装结果', res);
                }
            }

            return res;
        }
    },
}

task.log();
//开启线程  自动关闭弹窗
Engines.executeScript("unit/dialogClose.js");
System.setAccessibilityMode('fast');//快速模式
let i = 3;//最大运行次数
let taskData = WebSocketTaskJs.getFirstTask();
Log.log('任务', taskData);
let suc = false;
while (i-- > 0) {
    try {
        if (task.run(taskData)) {
            Log.log('任务成功');
            WebSocketTaskJs.completeTaskSuccess(taskData.task_id);
            suc = true;
        }
        break;
    } catch (e) {
        Log.log('执行异常', e);
        tCommon.backHome();
        tCommon.back(2);
        System.sleep(2000);
    }
}

task.back(task.backCount || 5);
if (!suc) {
    Log.log('任务失败');
    WebSocketTaskJs.completeTaskFailed(taskData.task_id);
}

Log.log('返回到APP');
App.backApp();
System.sleep(2000);
Engines.closeAllNoShowAlert();
