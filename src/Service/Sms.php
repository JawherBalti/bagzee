<?php
namespace App\Service;


class Sms
{

    public function sendSms($senderType,$num,$msg) {
        try {

            $num=str_replace(' ','',$num);
            if(substr($num, 0, 1) === "0" &&substr($num, 1, 3) !== "033"){

                $num= "0033".substr($num,1,strlen($num));
            }
            if(substr($num, 0, 2) === "33"){

                $num= "00".$num;
            }
            $smsUrl = "https://www.ovh.com/cgi-bin/sms/http2sms.cgi";
            $data = array(
                'smsAccount' => '*****',
                'login' => '*****',
                'password' => '*****',
                'from' => '*****',
                'to' => $num,
                'noStop' => '1',
                'contentType' => 'text/json',
                'message' => html_entity_decode($msg));
            $final = $smsUrl . "?" . http_build_query($data);
            $ch = curl_init($final);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            $dt = curl_exec($ch);
                $dt=json_decode($dt);
            if(intval($dt->status)==100)
            {
                curl_close($ch);
                return 1;
            }
            else
            {
                curl_close($ch);
                return 0;
            }



        } catch (\Exception $ex) {

            return 0;
        }
    }

}
