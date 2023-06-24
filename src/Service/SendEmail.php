<?php
namespace App\Service;


use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\MailerInterface;
class SendEmail
{

    protected MailerInterface $mailer;

    public function __construct(

        MailerInterface $mailer
    ) {

        $this->mailer = $mailer;
    }
    public function sendEmail($subject,$to,$html)
    {
        $email = new Email();
        $email
            ->from('Bagzee@gmail.com')
            ->subject($subject)
            ->html($html)
            ->to($to)
        ;
        try
        {
        $res=$this->mailer->send($email);
    
       
        }
        catch(\Exception $ex)
        {
            print_r($ex->getMessage());
        }

    }
}
