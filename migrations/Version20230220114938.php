<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230220114938 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE admin');
        $this->addSql('ALTER TABLE baggiste_query ADD baggagite_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE baggiste_query ADD CONSTRAINT FK_4047E3F2C1DE5FA4 FOREIGN KEY (baggagite_id) REFERENCES baggagite (id)');
        $this->addSql('CREATE INDEX IDX_4047E3F2C1DE5FA4 ON baggiste_query (baggagite_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE admin (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci` COMMENT \'(DC2Type:json)\', password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, UNIQUE INDEX UNIQ_880E0D76E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE baggiste_query DROP FOREIGN KEY FK_4047E3F2C1DE5FA4');
        $this->addSql('DROP INDEX IDX_4047E3F2C1DE5FA4 ON baggiste_query');
        $this->addSql('ALTER TABLE baggiste_query DROP baggagite_id');
    }
}
