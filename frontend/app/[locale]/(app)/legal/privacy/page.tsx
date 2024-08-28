import React from "react";
import PageContainer from "@/components/PageContainer";
import styles from "@/styles/Legal.module.scss";

import { genPageMetadata } from "@/app/seo";

export const metadata = genPageMetadata({
  title: "Politique de confidentialité",
  description:
    "Découvrez notre politique de confidentialité et apprenez comment KYYNK protège vos informations personnelles, gère les cookies et respecte les régulations en matière de protection des données.",
});

const privacyPage = () => {
  return (
    <PageContainer>
      <div className={styles.container}>
        <h1>Confidentialité</h1>
        <div className={styles.textContainer}>
          <h2>Qui est le responsable de traitement ?</h2>
          <p>
            Le responsable des traitements de données personnelles visé
            ci-dessous est l’éditeur du site internet KYYNK.
          </p>
          <h2>Pourquoi recueillons-nous vos données personnelles ?</h2>
          <p>
            KYYNK traite vos données uniquement lorsque cela est autorisé par la
            réglementation, dans le respect du Règlement général sur la
            protection des données (RGPD) et de la loi Informatique et Libertés
            modifiée.  Vos données personnelles sont susceptibles d’être
            recueillies pour des finalités suivantes :
          </p>
          <ul>
            <li>Gestion des comptes utilisateurs,</li>
            <li>Gestion et suivi des ventes,</li>
            <li>Prospection et promotion commerciale de nos services.</li>
          </ul>
          <h2>Gestion des comptes utilisateurs</h2>
          <p>
            La gestion de votre inscription à KYYNK suppose la mise en œuvre
            d’un traitement de données personnelles sur la base des conditions
            générales d’utilisation que vous avez acceptées sur notre site
            internet.{" "}
          </p>
          <h2>Compte « Créateur »</h2>
          <p>
            En tant que « Créateur », la création de votre compte implique de
            pouvoir vérifier votre âge ainsi que votre identité. Lors de la
            création de votre compte, vous êtes invité(e) à créer un profil
            privé en renseignant des informations obligatoires, matérialisées
            par un astérisque. Ces informations sont toutes nécessaires à la
            poursuite des finalités décrites dans cette section. A défaut, il ne
            vous sera pas permis de créer un compte et de bénéficier des
            services associés. Ce profil privé qui comprend votre identité n’est
            pas rendu accessible au public. Vous avez également la faculté
            d’alimenter un profil public, accessible par les autres utilisateurs
            de KYYNK, en précisant certaines informations sur vos habitudes
            personnelles, vos préférences, etc. Ces informations ne sont pas
            obligatoires. Afin de vous garantir l’anonymat, le profil public est
            associé au pseudo que vous avez choisi lors de la création du
            compte. Les « Créateurs » peuvent vendre des médias et discuter avec
            les autres utilisateurs de la plateforme.
          </p>
          <h2>Compte « Acheteur »</h2>
          <p>
            Lors de la création de votre compte, vous êtes invité(e) à créer un
            profil privé en renseignant des informations obligatoires,
            matérialisées par un astérisque. Ces informations sont toutes
            nécessaires à la poursuite des finalités décrites dans cette
            section. A défaut, il ne vous sera pas permis de créer un compte et
            de bénéficier des services associés. Ce profil privé qui comprend
            votre identité n’est pas rendu accessible au public. Vous avez
            également la faculté d’alimenter un profil public, accessible par
            les autres utilisateurs de KYYNK, en précisant certaines
            informations sur vos habitudes personnelles, vos préférences, etc.
            Ces informations ne sont pas obligatoires. Afin de vous garantir
            l’anonymat, le profil public est associé au pseudo que vous avez
            choisi lors de la création du compte. Enfin, la création de votre
            compte vous permet d’acheter des médias des « Créateurs », de suivre
            vos achats, d’échanger avec les autres utilisateurs via le chat
            privé, et de paramétrer des notifications.
          </p>
          <h2>
            Quelles données vous concernant sommes-nous susceptibles de
            recueillir ?
          </h2>
          <p>
            En fonction des finalités de traitement visées ci-dessus, voici les
            catégories de données personnelles vous concernant susceptibles
            d’être traitées par KYYNK.
          </p>
          <ul>
            <li>
              Données d’identification : nom, prénom, civilité, sexe, pseudo,
              copie du document d’identité, identifiant, photos, adresse email,
              téléphone, adresse IP, etc. ;
            </li>
            <li>
              Données relatives au compte : profil (créateur/acheteur), données
              liées à l’inscription (date de création, date de la dernière
              connexion, langue favorite, etc.), signalement, motif du
              bannissement, données de modération, etc. ;
            </li>
            <li>
              Données relatives aux achats/ventes : objet de la vente,
              référence, date et montant de la transaction, coordonnées
              bancaires, etc.
            </li>
            <li>
              Données sensibles (facultatives) : préférences sexuelles, «
              spécialités », orientation sexuelle, ethnie ;
            </li>
            <li>
              Données relatives à la vie personnelle (facultatives) : statut
              matrimonial, habitudes ou préférences personnelles, etc. ;
            </li>
            <li>
              Données morphologiques (facultatives) : taille, poids, bonnet de
              soutien-gorge, etc. ;
            </li>
          </ul>
          <h2>A qui vos données personnes sont-elles transmises ?</h2>
          <p>
            Nous accordons la plus haute importance à la confidentialité de vos
            données. Elles ne seront ni cédées ni vendues. Seuls les équipes de
            KYYNK et leurs sous-traitants ont accès à vos données personnelles
            dans le respect des finalités visées ci-dessus.
          </p>
          <h2>
            Vos données sont-elles transférées en-dehors de l’Union européennes
            ?
          </h2>
          <p>
            Vos données personnelles sont hébergées et traitées en France. Aucun
            transfert de données personnelles n’est effectué à destination d’un
            pays situé en-dehors de l’Union européenne.
          </p>
          <h2>Combien de temps conservons-nous vos données personnelles ?</h2>
          <p>
            Nous conservons vos données personnelles uniquement pendant la durée
            strictement nécessaire à la poursuite des finalités visées
            ci-dessus. Gestion des comptes utilisateurs : pendant la durée de
            l’inscription ; Vente des médias des « Créateurs » : pendant la
            durée nécessaire à la gestion commerciale ; Prospection et promotion
            de nos services : 3 ans après la fin de la relation contractuelle.
            Enfin, vos données personnelles sont susceptibles d’être archivées
            pour éviter toute réclamation, gracieuse ou contentieuse, à
            l’encontre de KYYNK et lui permettre, en cas de besoin, d’argumenter
            et se défendre en justice.
          </p>
          <h2>Comment vos données personnelles sont-elles protégées ?</h2>
          <p>
            Nous recourons à de nombreuses mesures de sécurité pour assurer la
            sécurité et la confidentialité des données personnelles que vous
            nous confiez. Bien qu’il soit impossible de garantir une sécurité
            infaillible contre des intrusions à notre système d’information,
            nous mettons tout en œuvre, ainsi que nos prestataires, pour
            protéger vos données personnelles conformément à la réglementation
            en vigueur, notamment par des mesures de sécurité physiques et
            logiques. Ainsi, les données personnelles sont stockées sur des
            serveurs sécurisés. Seules les personnes habilitées peuvent accéder
            aux données via une double authentification. Enfin, nous n’avons pas
            accès à vos numéros de cartes bancaires. Leur sécurisation est
            assurée par nos prestataires de paiement, sélectionnés pour leur
            sérieux et tous certifiés.
          </p>
          <h2>Quels cookies utilisons-nous et pourquoi ?</h2>
          <p>
            Lors de la consultation de notre site des informations sont
            susceptibles d&apos;être enregistrées dans des fichiers « cookies »
            installés par KYYNK ou par des tiers dans votre ordinateur, tablette
            ou téléphone mobile afin d’assurer le bon fonctionnement de notre
            site et afin d’analyser notre trafic.{" "}
          </p>
          <h2>Qu’est-ce qu’un cookie ?</h2>
          <p>
            Le terme « cookie » désigne tant un fichier texte déposé dans un
            espace dédié du disque dur de votre terminal (ordinateur, tablette,
            téléphone mobile ou tout autre appareil optimisé pour Internet),
            lors de la consultation d’un contenu, que des technologies
            similaires permettant de lire ou écrire des informations sur le
            terminal d’un utilisateur. Certains cookies sont indispensables à
            l&apos;utilisation du site, d&apos;autres permettent
            d&apos;optimiser. Ils permettent notamment de se souvenir
            d’informations, comme les préférences des utilisateurs ou encore les
            informations précédemment saisies par l’utilisateur dans des
            formulaires présents sur le site. Un cookie ne permet pas
            d’identifier directement un utilisateur (il ne contient ni noms ou
            prénoms), mais le navigateur de votre terminal. Il permet toutefois
            de suivre les actions d’un même utilisateur à l’aide de
            l’identifiant unique contenu dans le fichier cookie. Le terme
            cookies est également utilisé de façon générique pour désigner
            d’autres technologies similaires comme les balises web ou pixel qui
            sont des petites images numériques invisibles à l’utilisateur
            intégrées sur les pages internet ou dans les courriels et qui
            associées au dépôt de cookies permettent de suivre et analyser la
            navigation d’un même utilisateur.{" "}
          </p>
          <h2>Les cookies que nous utilisons</h2>
          <p>
            Lors d’une visite sur le site, plusieurs types de cookies sont
            susceptibles d’être enregistrés dans votre terminal afin de répondre
            aux finalités décrites ci-dessous :
          </p>
          <h4>Cookies techniques </h4>
          <p>
            Les cookies techniques sont ceux indispensables à la navigation sur
            notre site comme les identifiants de session, la version de votre
            système d’exploitation qui vous permettent d&apos;utiliser les
            principales fonctionnalités du site, de signaler votre passage sur
            telle ou telle page. Les cookies techniques permettent également de
            mettre en œuvre des mesures de sécurité. Les cookies techniques ont
            une durée de vie très courte soit le temps de la session, ou 90
            jours pour le cookie de reconnexion automatique. Vous pouvez vous
            opposer à l’utilisation de ces cookies et les supprimer en utilisant
            les paramètres de votre navigateur, cependant vous risquez de ne
            plus pouvoir accéder au site ou d’avoir des services dégradés.
          </p>
          <h4>Cookies de mesure d’audience </h4>
          <p>
            Les cookies de mesure d’audience sont émis par nous ou par nos
            prestataires techniques aux fins de mesurer l’audience des
            différentes rubriques du site, afin de les évaluer et de mieux les
            organiser. Ils permettent, le cas échéant, de détecter des problèmes
            de navigation et par conséquent d’améliorer l’ergonomie de nos
            services. Les services d’analyses de fréquentation utilisés par le
            site ne produisent et n’adressent à nos prestataires techniques que
            des statistiques agrégées et des volumes de fréquentation, à
            l’exclusion de toute information individuelle. Ils ne permettent pas
            de suivre votre navigation sur d’autres sites.  La durée de vie de
            ces cookies de mesure d’audience n’excède pas 13 mois. Vous pouvez à
            tout moment activer ou désactiver ces cookies en vous rendant sur la
            page « Gestion des cookies » du site qui vous donne la possibilité
            de paramétrer les cookies soit globalement pour le site, soit
            service par service.
          </p>
          <h4>Cookies de partage - Réseaux sociaux</h4>
          <p>
            Sur certaines pages du site figurent des boutons ou modules de
            réseaux tiers au site. Ils vous permettent d’exploiter les
            fonctionnalités de ces réseaux et en particulier de partager des
            produits présents sur le site avec d’autres utilisateurs de ces
            réseaux. Des cookies sont directement déposés par ces réseaux
            sociaux dont nous n’avons pas la maîtrise. Tel est, notamment, le
            cas de « Twitter ». Le réseau social fournissant un tel bouton
            applicatif est susceptible de vous identifier grâce à ce bouton,
            même si vous ne l’avez pas utilisé lors de la consultation de notre
            site. Nous vous invitons à consulter la politique de confidentialité
            de Twitter et notamment la partie sur les cookies afin de prendre
            connaissance des finalités d’utilisation, notamment publicitaires,
            des informations de navigation qu’ils peuvent recueillir grâce à ces
            boutons applicatifs. Vous pouvez à tout moment activer ou désactiver
            ces cookies en vous rendant sur la page « Gestion des cookies » du
            site.
          </p>
          <h2>Comment paramétrer les cookies ?</h2>
          <h4>Recueil de votre consentement</h4>
          <p>
            Conformément aux modalités présentées dans le bandeau d’information
            sur la page d’accueil du site vous pouvez soit accepter l’ensemble
            des cookies soit sélectionner ceux que vous acceptez ou non.Vous
            pouvez à tout moment activer ou désactiver les cookies en vous
            rendant sur la page « Gestion des cookies » du site.
          </p>
          <h4>Suppression et/ou rejet des cookies.</h4>
          <p>
            La plupart des navigateurs sont paramétrés par défaut et acceptent
            l’installation de cookies, vous avez la possibilité, si vous le
            souhaitez, de choisir d’accepter tous les cookies ou de les rejeter
            systématiquement ou encore de choisir ceux que vous acceptez selon
            leurs émetteurs. Vous pouvez également paramétrer votre navigateur
            pour accepter ou refuser au cas par cas les cookies préalablement à
            leur installation. Vous pouvez également régulièrement supprimer les
            cookies de votre terminal via votre navigateur. Pour la gestion des
            cookies et de vos choix, la configuration de chaque navigateur est
            différente. Pour plus d’information et d’aide, vous pouvez consulter
            la page d’aide spécifique au navigateur que vous utilisez : Chrome™
            Firefox™ Internet Explorer™ Opera™ Safari™  Votre attention est
            attirée sur le fait qu’en paramétrant votre navigateur pour refuser
            les cookies, certaines fonctionnalités, pages, espaces du site ne
            seront pas accessibles, ce dont nous ne saurions être responsables.
            En outre, il vous appartient de ne pas oublier de paramétrer
            l’ensemble des navigateurs de vos différents terminaux (tablettes,
            smartphones, ordinateurs..).
          </p>
          <h2>Quels sont vos droits sur vos données personnelles ?</h2>
          <p>
            Conformément au Règlement européen à la protection des données
            (RGPD) et à la loi Informatique et Libertés modifiée, vous disposez
            du droit de demander l’accès aux données vous concernant, leur
            rectification ou leur effacement ainsi que la limitation du
            traitement. Vous pouvez aussi vous opposer au traitement de vos
            données et demander à NastNipples leur portabilité. Vous disposez
            également du droit de donner des directives sur le sort de vos
            données à caractère personnel après votre mort. Vous disposez,
            enfin, du droit d’introduire une réclamation auprès de la CNIL en
            cas de désaccord ou de contestations relatives au traitement de vos
            données personnelles depuis son site internet : https://www.cnil.fr
            . 
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default privacyPage;
