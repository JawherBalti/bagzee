<?php
namespace App\Service;


class Stripe
{

public function createCustomer($client,$entityManager)
{
	\Stripe\Stripe::setApiKey($_ENV["APP_STRIPE"]);
	if (is_null($client->getStripeCustomerId())) {
                $respone = \Stripe\Customer::create(array(
                    "email" => $client->getEmail(),
                    "description" => $client->getFirstname() . ' ' . $client->getLastname(),
                    "source" => null
                ));
                $client->setStripeCustomerId($respone->id);
                $entityManager->flush();
            }


            if(is_null($client->getStripeAccount()))
            {
 $phone=$client->getPhone();
 $birth=date_format($client->getBirdh(),'Y-m-d');
           $cle = '+33';
           $numero = substr($phone,1);
            $newNumeber = $phone;
            $token=\Stripe\Token::create(['account'=> [
                'business_type'=> 'individual',
                'individual'=> [
                    'first_name'=> $client->getFirstname(),
                    'last_name'=> $client->getLastname(),
                    'email'=> $client->getEmail(),
                    'phone'=> $newNumeber,
                    'address'=> [
                        'line1'=> 'paris 15 eme',
                        'city'=> 'paris',
                        'state'=> 'france',
                        'postal_code'=> '75001',
                    ],
                    'dob'=>['day'=>explode('-', $birth)[2],'month'=>explode('-', $birth)[1],'year'=>explode('-', $birth)[0]],

                ],
                'tos_shown_and_accepted'=> true,
            ]]);


              $account = \Stripe\Account::create([
                "type" => "custom",
                "country" => "FR",
                "email" => $client->getEmail(),
                "account_token" => $token->id,
                "requested_capabilities" => ['card_payments', 'transfers'],
                'business_profile'=>['mcc'=>'5734','url'=>'https://www.google.fr/']
            ]);

              $client->setStripeAccount($account->id);
               $entityManager->flush();
            }
}

}