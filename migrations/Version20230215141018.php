<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230215141018 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE baggagite_advert DROP FOREIGN KEY FK_D10FF8C3C1DE5FA4');
        $this->addSql('ALTER TABLE baggagite_advert DROP FOREIGN KEY FK_D10FF8C3D07ECCB6');
        $this->addSql('DROP TABLE admin');
        $this->addSql('DROP TABLE baggagite_advert');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE admin (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci` COMMENT \'(DC2Type:json)\', password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, UNIQUE INDEX UNIQ_880E0D76E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE baggagite_advert (baggagite_id INT NOT NULL, advert_id INT NOT NULL, INDEX IDX_D10FF8C3C1DE5FA4 (baggagite_id), INDEX IDX_D10FF8C3D07ECCB6 (advert_id), PRIMARY KEY(baggagite_id, advert_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE baggagite_advert ADD CONSTRAINT FK_D10FF8C3C1DE5FA4 FOREIGN KEY (baggagite_id) REFERENCES baggagite (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE baggagite_advert ADD CONSTRAINT FK_D10FF8C3D07ECCB6 FOREIGN KEY (advert_id) REFERENCES advert (id) ON DELETE CASCADE');
    }
}
