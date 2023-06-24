<?php
namespace App\Service;
class Helper
{
    function getStartAndEndDate($week, $year) {
        $dto = new \DateTime();
        $dto->setISODate($year, $week);
        $ret['week_start'] = $dto->format('Y-m-d');
        $dto->modify('+6 days');
        $ret['week_end'] = $dto->format('Y-m-d');
        return $ret;
    }


    function sendPushAllDevice($data)
{
dd($data);

    $msg = array
    (
        'body' => $data['content'],
        'title' => $data['title'],
        'click_action' => 'FCM_PLUGIN_ACTIVITY',
        'sound' => 'default'
    );

    $fields = array(
        'to' => '/topics/all',
        'data' => $data,
        'notification' => $msg,
        'priority' => 'high',
        'sound' => 'default'

    );


    //newkey chokri
    $key='AAAAqVR2fUE:APA91bHDzEXj6DsSaXyiGe9izvS_ia1Z7zlBZGWCwiDVcSOvJu7odpu3wlRo5KGBM3ODokZH8d6iMx_TC3HZMgsx026lkGawwPqtFx2FmNZ0ukioMRxUXk6K3doYJU7o_J2yeXWtCKgj';
    //oldkey
    //$key='AAAAqVR2fUE:APA91bHDzEXj6DsSaXyiGe9izvS_ia1Z7zlBZGWCwiDVcSOvJu7odpu3wlRo5KGBM3ODokZH8d6iMx_TC3HZMgsx026lkGawwPqtFx2FmNZ0ukioMRxUXk6K3doYJU7o_J2yeXWtCKgj';
    $url = 'https://fcm.googleapis.com/fcm/send';
    //by ahmed
    //$key='AAAA6-BrQgI:APA91bH31tCwYODhZmAQC-866IYpaPl4Vc0jAdGE5Jg-d-OD0isA6OCX6cJ4uu6WZfF2zbaZ2tYlXjuTXvcKHhWY8DoHEg_mPMjHSTHS8DpKSm6A1VTmGdZX0XcfWlTSMrZYk4qbgVHS';


    $headers = array(
        'Authorization: key=' . $key,
        'Content-Type: application/json'
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));

    $result = curl_exec($ch);

    if ($result === FALSE) {
//            die('Curl failed: ' . curl_error($ch));
    }



json_decode($result,true);

    curl_close($ch);





}
}



