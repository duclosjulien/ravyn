package com.ravyn.chat.user;

import com.ravyn.chat.exception.InvalidCredentialsException;
import com.ravyn.chat.exception.UserNotFoundException;
import com.ravyn.chat.exception.UsernameNotFoundException;
import com.ravyn.chat.exception.UsernameTakenException;
import com.ravyn.chat.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ChatUserResponse register(String username, String password){
        if(userRepository.findByUsername(username).isPresent())
            throw new UsernameTakenException(username);

        return createUser(username, passwordEncoder.encode(password));

    }

    private ChatUserResponse createUser(String username, String passwordHash){
        ChatUser newUser = userRepository.save(new ChatUser(username, passwordHash));
        return new ChatUserResponse(newUser.getId(), newUser.getUsername());
    }

    public ChatUserResponse login(String username, String password, HttpServletRequest request){
        ChatUser user = userRepository.findByUsername(username)
                .orElseThrow(InvalidCredentialsException::new);

        if(!passwordEncoder.matches(password, user.getPasswordHash()))
            throw new InvalidCredentialsException();

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        null,
                        List.of()
                );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        request.getSession(true)
                .setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

        return new ChatUserResponse(user.getId(), user.getUsername());
    }

    public UserSummary findUserByUsername(String username){
        ChatUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
        return new UserSummary(user.getId(), username);
    }
}
